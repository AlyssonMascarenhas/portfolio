import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

/**
 * Aura (a base do template Sakai) com o azul do portfólio como cor primária.
 * Os tons escolhidos para texto e botão (700 no claro, 400 no escuro) mantêm contraste AA:
 * o 500 padrão do Aura dá ~3.7:1 com texto branco.
 */
export const PortfolioPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.700}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.800}',
          activeColor: '{primary.900}',
        },
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.900}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
      },
    },
  },
  components: {
    // O texto da opção inativa dava 4.34:1 no claro (surface.500 sobre surface.100). Os dois modos
    // precisam do valor explícito: sem o do escuro, ele herda o do claro e cai para 2.57:1.
    togglebutton: {
      colorScheme: {
        light: { root: { color: '{surface.600}' } },
        dark: { root: { color: '{surface.400}' } },
      },
    },
  },
});
