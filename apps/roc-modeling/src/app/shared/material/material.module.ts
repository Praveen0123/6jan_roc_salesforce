import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

const globalRippleConfig: RippleGlobalOptions =
{
  disabled: true,
};

@NgModule({
  imports:
    [
      CommonModule
    ],
  declarations:
    [

    ],
  exports:
    [
      MatAutocompleteModule,
      MatBadgeModule,
      MatButtonModule,
      MatCheckboxModule,
      MatDialogModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatRadioModule,
      MatSelectModule,
      MatSidenavModule,
      MatSliderModule,
      MatSnackBarModule,
      MatExpansionModule,
      MatTabsModule,
      MatButtonToggleModule,
      MatProgressSpinnerModule
    ],
  providers:
    [
      { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { floatLabel: 'always' },
      },
    ],
})
export class MaterialModule
{ }
