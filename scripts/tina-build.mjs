import { spawnSync } from 'node:child_process';

/**
 * Local builds read the JSON files in this checkout.
 * When both TinaCloud variables are set, the admin and the on-demand
 * editing route are built against TinaCloud instead.
 */
const forceCloud = process.argv.includes('--cloud');
const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID?.trim() ?? '';
const token = process.env.TINA_TOKEN?.trim() ?? '';
const hasClient = clientId.length > 0;
const hasToken = token.length > 0;

if (hasClient !== hasToken) {
	console.error(
		'Define NEXT_PUBLIC_TINA_CLIENT_ID y TINA_TOKEN juntos, o deja los dos vacíos para un build local.',
	);
	process.exit(1);
}

if (forceCloud && !hasClient) {
	console.error('build:cloud necesita NEXT_PUBLIC_TINA_CLIENT_ID y TINA_TOKEN.');
	process.exit(1);
}

const useCloud = forceCloud || hasClient;

function run(command, args) {
	const result = spawnSync(command, args, { stdio: 'inherit' });
	if (result.status !== 0) process.exit(result.status ?? 1);
}

if (useCloud) {
	console.log('TinaCloud: building the editor and the site against the hosted content API.');
	run('tinacms', ['build']);
	run('astro', ['build']);
} else {
	console.log('Tina local: indexing content/ without TinaCloud.');
	run('tinacms', ['build', '--local', '--skip-cloud-checks', '-c', 'astro build']);
}
