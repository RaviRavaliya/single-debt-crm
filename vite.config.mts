import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path'; // Add this

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = 3000;

  return {
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: PORT,
      host: true
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // This sets up @ as alias for src
      },
    },
    build: {

      /** If you set esmExternals to true, this plugins assumes that 
        all external dependencies are ES modules */
   
      commonjsOptions: {
         esmExternals: true 
      },
   },
    base: API_URL,
    plugins: [react(), viteTsconfigPaths()]
  };
});
