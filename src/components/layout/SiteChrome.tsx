import { useState, type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { SearchOverlay } from "./SearchOverlay";

export function SiteChrome({
  children,
  transparentHeader = false,
}: {
  children: ReactNode;
  transparentHeader?: boolean;
}) {
  const [search, setSearch] = useState(false);
  return (
    <>
      <SiteHeader
        transparent={transparentHeader}
        onOpenSearch={() => setSearch(true)}
      />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}