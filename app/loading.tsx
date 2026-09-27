import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="container-page section-y">
      <LoadingState label="लोड हो रहा है..." />
    </div>
  );
}
