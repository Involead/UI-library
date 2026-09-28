/**
 * Icon set, rendered through <Icon name="..." />.
 *
 * To add an icon: create `<Name>Icon.tsx` in this folder exporting the
 * children of a 24×24 stroke <svg>, import it below, and add it to `icons` under
 * its kebab-case name (keep alphabetical order). It is then usable as
 * <Icon name="..." />.
 */

import { ArrowDownIcon } from "./ArrowDownIcon";
import { ArrowLeftIcon } from "./ArrowLeftIcon";
import { ArrowRightIcon } from "./ArrowRightIcon";
import { ArrowUpIcon } from "./ArrowUpIcon";
import { BellIcon } from "./BellIcon";
import { CalendarIcon } from "./CalendarIcon";
import { CheckCircleIcon } from "./CheckCircleIcon";
import { CheckIcon } from "./CheckIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { ChevronUpIcon } from "./ChevronUpIcon";
import { CloseIcon } from "./CloseIcon";
import { CopyIcon } from "./CopyIcon";
import { DeleteIcon } from "./DeleteIcon";
import { DownloadIcon } from "./DownloadIcon";
import { EditIcon } from "./EditIcon";
import { ErrorIcon } from "./ErrorIcon";
import { ExternalLinkIcon } from "./ExternalLinkIcon";
import { EyeIcon } from "./EyeIcon";
import { EyeOffIcon } from "./EyeOffIcon";
import { FilterIcon } from "./FilterIcon";
import { HeartIcon } from "./HeartIcon";
import { HomeIcon } from "./HomeIcon";
import { InfoIcon } from "./InfoIcon";
import { LoaderIcon } from "./LoaderIcon";
import { LockIcon } from "./LockIcon";
import { LogOutIcon } from "./LogOutIcon";
import { MailIcon } from "./MailIcon";
import { MenuIcon } from "./MenuIcon";
import { MinusIcon } from "./MinusIcon";
import { MoreHorizontalIcon } from "./MoreHorizontalIcon";
import { MoreVerticalIcon } from "./MoreVerticalIcon";
import { PlusIcon } from "./PlusIcon";
import { RefreshIcon } from "./RefreshIcon";
import { SearchIcon } from "./SearchIcon";
import { SettingsIcon } from "./SettingsIcon";
import { StarIcon } from "./StarIcon";
import { UploadIcon } from "./UploadIcon";
import { UserIcon } from "./UserIcon";
import { WarningIcon } from "./WarningIcon";

export const icons = {
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-up": ArrowUpIcon,
  bell: BellIcon,
  calendar: CalendarIcon,
  "check-circle": CheckCircleIcon,
  check: CheckIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-up": ChevronUpIcon,
  close: CloseIcon,
  copy: CopyIcon,
  delete: DeleteIcon,
  download: DownloadIcon,
  edit: EditIcon,
  error: ErrorIcon,
  "external-link": ExternalLinkIcon,
  eye: EyeIcon,
  "eye-off": EyeOffIcon,
  filter: FilterIcon,
  heart: HeartIcon,
  home: HomeIcon,
  info: InfoIcon,
  loader: LoaderIcon,
  lock: LockIcon,
  "log-out": LogOutIcon,
  mail: MailIcon,
  menu: MenuIcon,
  minus: MinusIcon,
  "more-horizontal": MoreHorizontalIcon,
  "more-vertical": MoreVerticalIcon,
  plus: PlusIcon,
  refresh: RefreshIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  star: StarIcon,
  upload: UploadIcon,
  user: UserIcon,
  warning: WarningIcon,
};

export type IconName = keyof typeof icons;
