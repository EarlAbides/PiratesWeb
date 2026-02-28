<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center p-8">
	<h1 class="mb-4 text-4xl font-bold">{page.status}</h1>
	<p class="text-lg">{page.error?.message ?? 'An unexpected error occurred.'}</p>
</div>
