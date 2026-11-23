import { InterfaceIcon, type InterfaceIconKind } from "../../shared/InterfaceIcon";
export type WardrobeIconKind = InterfaceIconKind;

export function WardrobeIcon({ kind }: { kind: WardrobeIconKind }) {
  return <InterfaceIcon kind={kind} />;
}
