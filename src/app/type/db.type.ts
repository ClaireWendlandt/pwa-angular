import { FormControl } from '@angular/forms';

export type LocalDbType = {
  localDbId?: number;
};

export type LocalDbPictureType = {
  localDbPicture?: Blob | string;
};

export type LocalDbFormType = {
  localDbId?: FormControl<number | null>;
};
