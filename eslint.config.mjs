import nextConfig from 'eslint-config-next';

const eslintConfig = [
  ...nextConfig,
  { ignores: ['.next/**', 'node_modules/**'] },
  {
    rules: {
      // Los componentes cliente de este proyecto usan efectos legítimos
      // (fetch + setState, valores solo-cliente para evitar mismatch de
      // hidratación, temporizadores de animación): no hay alternativa más
      // simple sin introducir abstracciones innecesarias.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default eslintConfig;
