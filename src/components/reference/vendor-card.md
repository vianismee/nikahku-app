````html
<div
  class="relative overflow-hidden rounded-xl border border-border/60 p-3.5 space-y-2.5 hover:shadow-md transition-all bg-gradient-to-br from-rose-soft/25 via-card to-muted/15"
>
  <div class="flex items-start gap-2">
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-sm break-words">MUA Test</p>
      <span
        data-slot="badge"
        data-variant="outline"
        class="group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-4xl border px-2.5 py-0.5 whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;&gt;svg]:pointer-events-none [&amp;&gt;svg]:size-3.5! border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground font-normal text-xs mt-1"
        >MUA</span
      >
    </div>
    <div class="flex gap-0.5 shrink-0">
      <button class="p-1.5 rounded-lg hover:bg-accent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-pencil h-3.5 w-3.5 text-muted-foreground"
          aria-hidden="true"
        >
          <path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          ></path>
          <path d="m15 5 4 4"></path>
        </svg></button
      ><button class="p-1.5 rounded-lg hover:bg-destructive/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-trash2 lucide-trash-2 h-3.5 w-3.5 text-muted-foreground hover:text-destructive"
          aria-hidden="true"
        >
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
          <path d="M3 6h18"></path>
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-x-3 text-sm">
    <div>
      <p class="text-[10px] text-muted-foreground">Estimasi</p>
      <p class="font-medium tabular-nums text-xs">Rp&nbsp;15.000.000</p>
    </div>
    <div>
      <p class="text-[10px] text-muted-foreground">Deal</p>
      <p class="font-semibold tabular-nums text-xs text-primary">Rp&nbsp;0</p>
    </div>
  </div>
  <div
    class="flex items-center justify-between pt-2 border-t border-border/40"
    data-tutorial="vendor-contact"
  >
    <p class="text-xs text-muted-foreground">-</p>
    <div class="flex items-center gap-2"></div>
  </div>
  <div class="flex items-center justify-between pt-2 border-t border-border/40">
    <button
      disabled=""
      class="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors text-muted-foreground/20 cursor-default pointer-events-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-chevron-left h-3 w-3"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6"></path>
      </svg></button
    ><button
      class="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      Negosiasi<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-chevron-right h-3 w-3"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </button>
  </div>
</div>
```
````
