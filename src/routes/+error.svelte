<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-8">
  <h1 class="text-4xl font-bold mb-4">{page.status}</h1>
  <p class="text-lg">{page.error?.message ?? 'An unexpected error occurred.'}</p>
</div>
