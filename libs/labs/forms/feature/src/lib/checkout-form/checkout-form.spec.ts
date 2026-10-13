import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CHECKOUT_CONTENT } from '../checkout/checkout.content';
import { provideFormsTesting } from '../testing';
import { CheckoutForm } from './checkout-form';

describe('CheckoutForm (Signal Forms)', () => {
  let el: HTMLElement;
  let http: HttpTestingController;

  const input = (id: string) =>
    el.querySelector<HTMLInputElement>(`#${id}`) as HTMLInputElement;
  const error = (id: string) =>
    el.querySelector(`#${id}-error`)?.textContent?.trim();
  const type = (id: string, value: string) => {
    input(id).value = value;
    input(id).dispatchEvent(new Event('input'));
    TestBed.tick();
  };
  const blur = (id: string) => {
    input(id).dispatchEvent(new Event('blur'));
    TestBed.tick();
  };
  /** Digita e sai do campo, como uma pessoa faria. */
  const fill = (id: string, value: string) => {
    type(id, value);
    blur(id);
  };
  const metrics = () =>
    [...el.querySelectorAll('pf-instrumentation-panel dd')].map((d) =>
      d.textContent?.trim(),
    );
  const couponRequests = () =>
    http.match((r) => r.url.startsWith('api/lab/coupon'));

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: provideFormsTesting() });
    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(CheckoutForm);
    fixture.componentRef.setInput('labels', CHECKOUT_CONTENT['pt-br'].demo);
    el = fixture.nativeElement;
    TestBed.tick();
  });

  afterEach(() => vi.useRealTimers());

  describe('quando o erro aparece', () => {
    it('não mostra erro enquanto o campo não foi tocado, mesmo com valor inválido', () => {
      type('co-name', 'ab');

      expect(error('co-name')).toBe('');
      expect(input('co-name').getAttribute('aria-invalid')).toBe('false');
    });

    it('mostra o erro ao sair do campo e o remove quando a pessoa corrige', () => {
      fill('co-name', 'ab');
      expect(error('co-name')).toBe('Use pelo menos 3 caracteres.');
      expect(input('co-name').getAttribute('aria-invalid')).toBe('true');
      expect(input('co-name').getAttribute('aria-describedby')).toBe(
        'co-name-error',
      );

      type('co-name', 'abc');

      expect(error('co-name')).toBe('');
      expect(input('co-name').getAttribute('aria-describedby')).toBeNull();
    });

    it('campo obrigatório vazio mostra a mensagem de obrigatório', () => {
      blur('co-name');

      expect(error('co-name')).toBe('Este campo é obrigatório.');
    });
  });

  describe('regras síncronas', () => {
    it('e-mail precisa ter formato válido', () => {
      fill('co-email', 'ana@');
      expect(error('co-email')).toBe('Informe um e-mail válido.');

      type('co-email', 'ana@example.com');
      expect(error('co-email')).toBe('');
    });

    it('a confirmação precisa ser igual ao e-mail, mesmo se o e-mail mudar depois', () => {
      fill('co-email', 'ana@example.com');
      fill('co-confirm', 'ana@example.com');
      expect(error('co-confirm')).toBe('');

      type('co-email', 'outra@example.com'); // a regra lê o valor do outro campo

      expect(error('co-confirm')).toBe('Os e-mails não são iguais.');
    });

    it.each([
      ['0', 'A quantidade mínima é 1.'],
      ['11', 'A quantidade máxima é 10.'],
      ['5', ''],
    ])('quantidade %s: "%s"', (value, message) => {
      fill('co-quantity', value);

      expect(error('co-quantity')).toBe(message);
    });
  });

  describe('cupom (validação assíncrona)', () => {
    /** Avança o relógio falso e deixa o Angular e as promises do resource se resolverem. */
    const advance = async (ms: number) => {
      await vi.advanceTimersByTimeAsync(ms);
      TestBed.tick();
      await vi.advanceTimersByTimeAsync(0);
      TestBed.tick();
    };

    it('espera 400 ms sem digitar e dispara uma consulta só, não uma por tecla', async () => {
      for (const partial of [
        'P',
        'PR',
        'PRO',
        'PROM',
        'PROMO',
        'PROMO1',
        'PROMO10',
      ]) {
        type('co-coupon', partial);
        await advance(50);
      }
      await advance(349);
      expect(couponRequests()).toHaveLength(0);

      await advance(1);
      const requests = couponRequests();

      expect(requests).toHaveLength(1);
      expect(requests[0].request.url).toBe('api/lab/coupon?code=PROMO10');
    });

    it('cupom válido não gera erro', async () => {
      fill('co-coupon', 'PROMO10');
      await advance(400);
      couponRequests()[0].flush({ valid: true, discountPercent: 10 });
      await advance(0);

      expect(error('co-coupon')).toBe('');
    });

    it('cupom inválido mostra o erro', async () => {
      fill('co-coupon', 'NAOEXISTE');
      await advance(400);
      couponRequests()[0].flush({ valid: false });
      await advance(0);

      expect(error('co-coupon')).toBe('Cupom inválido.');
    });

    it('falha de rede na consulta mostra "não foi possível validar", sem travar o formulário', async () => {
      fill('co-coupon', 'PROMO10');
      await advance(400);
      couponRequests()[0].flush(null, { status: 500, statusText: 'Error' });
      await advance(0);

      expect(error('co-coupon')).toBe(
        'Não foi possível validar o cupom agora.',
      );
    });

    it('campo vazio não consulta o servidor', async () => {
      fill('co-coupon', '   ');
      await advance(1000);

      expect(couponRequests()).toHaveLength(0);
    });

    it('a instrumentação conta as consultas disparadas', async () => {
      fill('co-coupon', 'PROMO10');
      await advance(400);
      TestBed.tick(); // os contadores são publicados depois do render

      const [, , , , , couponChecks] = metrics();
      expect(couponChecks).toBe('1');
    });
  });

  describe('envio', () => {
    const fillValid = () => {
      fill('co-name', 'Ana Souza');
      fill('co-email', 'ana@example.com');
      fill('co-confirm', 'ana@example.com');
      fill('co-quantity', '2');
    };
    const submit = async () => {
      el.querySelector<HTMLButtonElement>('button[type=submit]')?.click();
      await vi.advanceTimersByTimeAsync(0);
      TestBed.tick();
    };

    it('com erros, não envia e leva o foco ao primeiro campo inválido', async () => {
      await submit();

      expect(http.match('api/lab/checkout')).toHaveLength(0);
      expect(document.activeElement).toBe(input('co-name'));
      expect(error('co-name')).toBe('Este campo é obrigatório.');
      expect(error('co-email')).toBe('Este campo é obrigatório.');
    });

    it('com tudo válido, envia o pedido sem o campo de confirmação e mostra o resultado', async () => {
      fillValid();

      await submit();
      const [request] = http.match('api/lab/checkout');
      expect(request.request.body).toEqual({
        name: 'Ana Souza',
        email: 'ana@example.com',
        quantity: 2,
        coupon: '',
      });
      expect(
        el.querySelector<HTMLButtonElement>('button[type=submit]')?.disabled,
      ).toBe(true);

      request.flush({ id: 'ord_4242' });
      await vi.advanceTimersByTimeAsync(0);
      TestBed.tick();

      expect(el.querySelector('.success')?.textContent).toContain(
        'Pedido ord_4242 criado.',
      );
    });

    it('quando o servidor recusa o e-mail, o erro aparece no campo de e-mail', async () => {
      fillValid();

      await submit();
      http
        .match('api/lab/checkout')[0]
        .flush(
          { errors: [{ field: 'email', code: 'email_taken' }] },
          { status: 422, statusText: 'Unprocessable' },
        );
      await vi.advanceTimersByTimeAsync(0);
      TestBed.tick();

      expect(error('co-email')).toBe('Este e-mail já tem cadastro.');
      expect(el.querySelector('.success')).toBeNull();
    });

    it('falha inesperada do servidor mostra o aviso geral', async () => {
      fillValid();

      await submit();
      http
        .match('api/lab/checkout')[0]
        .flush(null, { status: 500, statusText: 'Server Error' });
      await vi.advanceTimersByTimeAsync(0);
      TestBed.tick();

      expect(el.querySelector('p-message[role=alert]')?.textContent).toContain(
        'Não foi possível enviar o pedido',
      );
    });
  });
});
