import { FormControl } from '@angular/forms';

export type LocalDbType = {
  localDbId?: number;
};

export type LocalDbFormType = {
  localDbId?: FormControl<number | null>;
};
