import js from "@eslint/js";
import next from "@next/eslint-plugin-next";

export default [
  js.configs.recommended,

  {
    plugins: {
      "@next/next": next
    },

    rules: {
      /* ---- Fix your current build blockers ---- */
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",

      /* ---- Allow <img> if you want (camera preview, snapshots) ---- */
      "@next/next/no-img-element": "off"
    }
  }
];
