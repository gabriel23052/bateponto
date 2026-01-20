/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import os from "node:os";

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom",
    execArgv: [
      "--localstorage-file",
      path.resolve(os.tmpdir(), `vitest-${process.pid}.localstorage`),
    ],
  },
  plugins: [
    svgr(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});

