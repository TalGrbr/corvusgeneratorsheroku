import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';

const maxAge = 30000;

@Injectable({
  providedIn: 'root'
})

export class RequestCache {
  cache = new Map<string, Map<any, any>>();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const reqBody = req.body;
    const cached = this.cache.get(url);
    let cachedBody;
    if (cached) {
      cachedBody = cached.get(reqBody);
    }
    if (!cachedBody) {
      return undefined;
    }
    if (cachedBody.lastRead < (Date.now() - maxAge)) {
      return undefined;
    }
    // const expired = isExpired ? 'expired ' : '';
    return cachedBody.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;
    const mapEntry = {url, response, lastRead: Date.now()};
    const reqBody = req.body;
    if (this.cache.has(url)) {
      this.cache.get(url).set(reqBody, mapEntry);
    } else {
      const entry = new Map();
      entry.set(reqBody, mapEntry);
      this.cache.set(url, entry);
    }

    const expired = Date.now() - maxAge;
    this.cache.forEach(entryMap => {
      entryMap.forEach(entryExpired => {
        if (entryExpired.lastRead < expired) {
          entryMap.delete(entryExpired);
          if (Object.keys(entryMap).length === 0) {
            this.cache.delete(entryExpired.url);
          }
        }
      });
    });
  }

  clearCache() {
    this.cache = new Map();
  }

  logCache() {
    console.log(this.cache);
  }
}
