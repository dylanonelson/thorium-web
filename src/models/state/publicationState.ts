import { IProgression } from "../progression";
import { TocItem } from "@/packages/Helpers/createTocTree";

export interface IPublicationState {
  runningHead?: string;
  isFXL: boolean;
  isRTL: boolean;
  progression: IProgression;
  atPublicationStart: boolean;
  atPublicationEnd: boolean;
  tocTree?: TocItem[];
  tocEntry?: string;
}