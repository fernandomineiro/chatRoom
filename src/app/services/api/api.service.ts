import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

/**
 * Classe para tratar requisições RESTfull
 * @author Arthur Duarte <arthur.duarte@harmis.com.br>
 * @version 1.0.0
 *
 * Link da documentação da API
 * @see https://documenter.getpostman.com/view/2858314/S1Zw8Auv
 */
export class ApiService
{
  /**
   * URL da requisição que precisamos realizar
   * @author Arthur Duarte <arthur.duarte@harmis.com.br>
   * @version 1.0.0
   * @property {String} url URL por extenso
   */
  url: string = 'https://teste.saladeencontro.com.br/api/v1';

  constructor(private http: HttpClient) {
    this.url = environment.API_URL
  }

  /**
   * Monta o cabeçalho padrão para a requisição
   * @author Arthur Duarte <arthur.duarte@harmis.com.br>
   * @version 1.0.0
   * @returns {Object} JSON com o cabeçalho montado
   */
  getHeaders()
  {
    // Token de acesso do usuário
    // Adquirido quando é feito login e/ou novo cadastro
    let userToken = localStorage.getItem('token');

    return {
      headers: {'Authorization': userToken}
    }
  }

  setAuthToken(token) {
    localStorage.setItem('token', token)
  }

  /**
   * Identifica e altera endpoints usando a mesma sintaxe de rotas do angular.
   * Ex: Parametros {id: 5} e rota /resource/:id
   * se transforma em resource/5
   * @param params
   * @param endpoint
   * @returns string
   */
  paramsToUrl(params: {}, endpoint: string) {
    let regex, oldendpoint = endpoint;
    for (let key in params) {
      regex = new RegExp('\:' + key + '\\b');
      endpoint = oldendpoint.replace(regex, params[key] + '');
      oldendpoint = endpoint;
    }
    return endpoint;
  }

  /**
   * Método para realizar requisições do tipo GET na API
   * @author Arthur Duarte <arthur.duarte@harmis.com.br>
   * @version 1.0.0
   *
   * @property {String} endpoint Endpoint após a URL padrão da API
   * @property {Object} params   Parâmetros a serem enviados na requisição pela URL (sempre chave: valor)
   * @property {Object} reqOpts  Dados a serem enviados no cabeçalho da requisição (sempre chave: valor)
   *
   * @returns {Object} Objeto http para tratar o resultado da requisição
   */
  get(endpoint: string, params?: any, reqOpts?: any)
  {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) reqOpts.params = reqOpts.params.set(k, params[k]);
    }

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  /**
   * Método para realizar requisições do tipo POST na API
   * @author Arthur Duarte <arthur.duarte@harmis.com.br>
   * @version 1.0.0
   *
   * @property {String} endpoint      Endpoint após a URL padrão da API
   * @property {String|Object} body   Conteúdo do "body" a ser enviado na requisição (o tipo varia de acordo com a API)
   * @property {Object} reqOpts       Dados a serem enviados no cabeçalho da requisição (sempre chave: valor)
   *
   * @returns {Object} Objeto http para tratar o resultado da requisição
   */
  post(endpoint: string, body: any, reqOpts?: any)
  {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  /**
   * Método para realizar requisições do tipo PUT na API
   * @author Arthur Duarte <arthur.duarte@harmis.com.br>
   * @version 1.0.0
   *
   * @property {String} endpoint      Endpoint após a URL padrão da API
   * @property {String|Object} body   Conteúdo do "body" a ser enviado na requisição (o tipo varia de acordo com a API)
   * @property {Object} reqOpts       Dados a serem enviados no cabeçalho da requisição (sempre chave: valor)
   *
   * @returns {Object} Objeto http para tratar o resultado da requisição
   */
  put(endpoint: string, body: any, reqOpts?: any)
  {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  /**
   * Método para realizar requisições do tipo DELETE na API
   * @author Arthur Duarte <arthur.duarte@harmis.com.br>
   * @version 1.0.0
   *
   * @property {String} endpoint   Endpoint após a URL padrão da API
   * @property {Object} reqOpts    Dados a serem enviados no cabeçalho da requisição (sempre chave: valor)
   *
   * @returns {Object} Objeto http para tratar o resultado da requisição
   */
  delete(endpoint: string, reqOpts?: any)
  {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  /**
   * Método para realizar requisições do tipo PATCH na API
   * @author Arthur Duarte <arthur.duarte@harmis.com.br>
   * @version 1.0.0
   *
   * @property {String} endpoint      Endpoint após a URL padrão da API
   * @property {String|Object} body   Conteúdo do "body" a ser enviado na requisição (o tipo varia de acordo com a API)
   * @property {Object} reqOpts       Dados a serem enviados no cabeçalho da requisição (sempre chave: valor)
   *
   * @returns {Object} Objeto http para tratar o resultado da requisição
   */
  patch(endpoint: string, body: any, reqOpts?: any)
  {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }
}

// End of file api.service.ts
// Path: ./src/app/services/api/api.service.ts
