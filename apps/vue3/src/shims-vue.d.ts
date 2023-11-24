declare module 'vue' {
  import { AxiosInstance } from "axios";
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

export {}