import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FaConfig, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAmazon, faApple, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faBookmark as faBookmarkLight, faCopy, faHeart as faHeartLight, faSignOutAlt, faSync, faTimes } from '@fortawesome/pro-light-svg-icons';
import {
  faArrowLeft,
  faArrowRight,
  faBookmark,
  faCheck,
  faClone,
  faCompressArrowsAlt,
  faExpandArrowsAlt,
  faHeart,
  faHome,
  faLockAlt,
  faPencilAlt,
  faPlus,
  faRedoAlt,
  faShareSquare,
  faSignInAlt,
  faTimes as faTimesSolid,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class FontAwesomeIconRegistryService
{
  private isInitialized = false;

  readonly iconNameToSoureMappings: { [iconName: string]: string; } =
    {
      ['icon-owl-compare']: '/assets/images/roc-owl-compare.svg'
    };
  constructor
    (
      private library: FaIconLibrary,
      private faConfig: FaConfig,
      private matIconRegistry: MatIconRegistry,
      private domSanitizer: DomSanitizer
    ) { }

  init(): void
  {
    if (this.isInitialized)
    {
      return;
    }

    // config
    this.faConfig.defaultPrefix = 'fal';

    // brand icons
    this.library.addIcons
      (
        faFacebook,
        faGoogle,
        faAmazon,
        faApple
      );

    // light icons
    this.library.addIcons
      (
        faBookmarkLight,
        faCopy,
        faHeartLight,
        faSignOutAlt,
        faSync,
        faTimes
      );

    // solid icons
    this.library.addIcons
      (
        faArrowLeft,
        faArrowRight,
        faBookmark,
        faCheck,
        faClone,
        faCompressArrowsAlt,
        faExpandArrowsAlt,
        faHeart,
        faHome,
        faLockAlt,
        faPencilAlt,
        faPlus,
        faRedoAlt,
        faShareSquare,
        faSignInAlt,
        faTimesSolid,
        faTrash
      );

    Object.keys(this.iconNameToSoureMappings).forEach((iconName) =>
    {
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          this.iconNameToSoureMappings[iconName]
        )
      );
    });

    this.isInitialized = true;
  }
}
