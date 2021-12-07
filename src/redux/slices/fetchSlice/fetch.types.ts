import { ResponseBody } from '../../../native components/fetch';

export interface FetchInstance {
  url: string;
  get: (extension: string, headers?: any) => Promise<ResponseBody>;
  post: (extension: string, body?: any, headers?: any) => Promise<ResponseBody>;
}
