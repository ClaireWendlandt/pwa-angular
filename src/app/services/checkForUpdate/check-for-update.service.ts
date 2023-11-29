import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CheckForUpdateService {
  constructor(appRef: ApplicationRef, updates: SwUpdate) {
    console.log('in check for update');
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(
      first((isStable) => isStable === true)
    );
    const everySixHours$ = interval(100000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await updates.checkForUpdate();

        console.log(
          updateFound
            ? 'A new version is available.'
            : 'Already on the latest version.'
        );

        if (updateFound) {
          document.location.reload();
        }
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }
}
