<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    sidebar: Snippet;
    children: Snippet;
  }

  let { sidebar, children }: Props = $props();
</script>

<div class="flex flex-1 flex-col xl:flex-row overflow-hidden">
  <aside class="w-full xl:w-72 xl:shrink-0 xl:overflow-y-auto border-b xl:border-b-0 xl:border-r border-neutral-800">
    {@render sidebar()}
  </aside>
  <main class="flex-1 overflow-y-auto">
    {@render children()}
  </main>
</div>
