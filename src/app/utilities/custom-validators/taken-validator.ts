import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractControl, FormControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ManagementDataService} from '../../server-handlers/management-data.service';
import {PageDataService} from '../../server-handlers/page-data.service';

export const TakenValidator = (service: ManagementDataService | PageDataService, type) => (c: FormControl) => {
  let timeout;
  if (timeout) {
    clearTimeout(timeout);
  }
  if (type === 'username') {
    return new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        (service as ManagementDataService).isUsernameValid(c.value).subscribe(data => {
          if (data.body) {
            resolve({availability: true});
          } else {
            resolve(null);
          }
        });
      }, 500);
    });
  } else if (type === 'page name') {
    return new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        (service as PageDataService).isPageNameValid(c.value).subscribe(data => {
          if (data.body) {
            resolve({availability: true});
          } else {
            resolve(null);
          }
        });
      }, 500);
    });
  }

};
