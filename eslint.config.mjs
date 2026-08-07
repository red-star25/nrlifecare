import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  { ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"] },
];

export default eslintConfig;
