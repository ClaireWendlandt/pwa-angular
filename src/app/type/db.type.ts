import { FormControl } from '@angular/forms';

export type LocalDbType = {
  localDbId?: number;
};

export type LocalDbPictureType = {
  localDbPicture?: Blob;
};

export type LocalDbFormType = {
  localDbId?: FormControl<number | null>;
};
