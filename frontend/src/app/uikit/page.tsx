import { UIKitView } from "@/modules/uikit/views/uikit-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GRisk KIT UX / UI | GRisk",
  description: "Explora los componentes y tokens del sistema de diseño de GRisk.",
};

export default function UIKitPage() {
  return <UIKitView />;
}
