import type { INodeProperties } from 'n8n-workflow';

const showForShareLinks = {
	resource: ['shareLinks'],
};

const showOnlyForShareLinksList = {
	resource: ['shareLinks'],
	operation: ['list'],
};

const showOnlyForShareLinksCreate = {
	resource: ['shareLinks'],
	operation: ['create'],
};

const showOnlyForShareLinksUpdate = {
	resource: ['shareLinks'],
	operation: ['update'],
};

const showOnlyForShareLinksWrite = {
	resource: ['shareLinks'],
	operation: ['create', 'update'],
};

const emptyToUndefined = '={{String($value || "").trim() !== "" ? String($value).trim() : undefined}}';

// Settings shared by create and update, for both assets and boards.
const sharedSettings: INodeProperties[] = [
	{
		displayName: 'Active',
		name: 'active',
		type: 'boolean',
		default: true,
		description: 'Whether the link works. Disabling keeps its settings.',
		routing: { send: { type: 'body', property: 'active' } },
	},
	{
		displayName: 'Allow Download',
		name: 'allowDownload',
		type: 'boolean',
		default: false,
		description: 'Whether visitors can download the original files',
		routing: { send: { type: 'body', property: 'allowDownload' } },
	},
	{
		displayName: 'Comments',
		name: 'comments',
		type: 'options',
		default: 'read_only',
		options: [
			{ name: 'Allowed', value: 'allowed' },
			{ name: 'Hidden', value: 'hidden' },
			{ name: 'Read Only', value: 'read_only' },
		],
		description: 'What visitors can do with comments. “Allowed” writes to your workspace.',
		routing: { send: { type: 'body', property: 'comments' } },
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'options',
		default: 'read_only',
		options: [
			{ name: 'Editable', value: 'editable' },
			{ name: 'Hidden', value: 'hidden' },
			{ name: 'Read Only', value: 'read_only' },
		],
		description: 'What visitors can do with custom field values. “Editable” writes to your workspace.',
		routing: { send: { type: 'body', property: 'customFields' } },
	},
	{
		displayName: 'Expires At',
		name: 'expiresAt',
		type: 'dateTime',
		default: '',
		description: 'When the link stops working. Must be in the future.',
		routing: { send: { type: 'body', property: 'expiresAt', value: '={{$value ? new Date($value).toISOString() : undefined}}' } },
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		description: 'Password visitors must enter. Write-only.',
		routing: { send: { type: 'body', property: 'password', value: emptyToUndefined } },
	},
	{
		displayName: 'Require Account',
		name: 'requireAccount',
		type: 'boolean',
		default: false,
		description: 'Whether visitors must sign in to Air',
		routing: { send: { type: 'body', property: 'requireAccount' } },
	},
];

export const shareLinksDescription: INodeProperties[] = [
	{
		displayName: 'Target Type',
		name: 'shareLinkTarget',
		type: 'options',
		default: 'assets',
		displayOptions: { show: showForShareLinks },
		options: [
			{ name: 'Asset', value: 'assets' },
			{ name: 'Board', value: 'boards' },
		],
		description: 'Whether the share link belongs to an asset or a board',
	},
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForShareLinks, shareLinkTarget: ['assets'] } },
		description: 'The ID of the asset the share link belongs to',
	},
	{
		displayName: 'Board ID',
		name: 'boardId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForShareLinks, shareLinkTarget: ['boards'] } },
		description: 'The ID of the board the share link belongs to',
	},
	{
		displayName: 'Share Link ID',
		name: 'shareLinkId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForShareLinksUpdate },
		description: 'The ID of the share link to update',
	},
	// List
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'string',
		default: '12',
		displayOptions: { show: { ...showOnlyForShareLinksList, shareLinkTarget: ['assets'] } },
		description: 'The max number of share links to return (max 200)',
		routing: { send: { type: 'query', property: 'limit', value: '={{$value !== "" ? $value : undefined}}' } },
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnlyForShareLinksList, shareLinkTarget: ['assets'] } },
		description: 'Cursor to the next page of share links',
		routing: { send: { type: 'query', property: 'cursor', value: '={{$value !== "" ? $value : undefined}}' } },
	},
	// Create: which version an asset share link shows
	{
		displayName: 'Link Type',
		name: 'shareLinkType',
		type: 'options',
		default: 'evergreen',
		displayOptions: { show: { ...showOnlyForShareLinksCreate, shareLinkTarget: ['assets'] } },
		options: [
			{
				name: 'Follows Current Version',
				value: 'evergreen',
				description: 'Always shows the asset’s current version',
			},
			{
				name: 'Version-Pinned',
				value: 'pinned',
				description: 'Shows one specific asset version',
			},
		],
		description: 'Whether the link follows the current version or is pinned to a version',
		routing: {
			send: {
				type: 'body',
				property: 'followsDefaultVersion',
				value: '={{$value === "evergreen" ? true : undefined}}',
			},
		},
	},
	{
		displayName: 'Version ID',
		name: 'shareLinkVersionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForShareLinksCreate, shareLinkTarget: ['assets'], shareLinkType: ['pinned'] },
		},
		description: 'The ID of the asset version to pin the share link to',
		routing: { send: { type: 'body', property: 'versionId', value: emptyToUndefined } },
	},
	// Create / Update settings
	{
		displayName: 'Settings',
		name: 'shareLinkSettings',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: { show: showOnlyForShareLinksWrite },
		description: 'Omitted settings keep their current value (update) or follow your workspace defaults (create). Some settings depend on your plan.',
		options: sharedSettings,
	},
	{
		displayName: 'Show All Versions',
		name: 'showAllVersions',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...showOnlyForShareLinksWrite, shareLinkTarget: ['assets'] } },
		description: 'Whether visitors can browse other versions (version-pinned links only)',
		routing: { send: { type: 'body', property: 'showAllVersions' } },
	},
	{
		displayName: 'Remove Password',
		name: 'removePassword',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnlyForShareLinksUpdate },
		description: 'Whether to remove the existing password. Ignored if a password is set above.',
		routing: {
			send: {
				type: 'body',
				property: 'password',
				value: '={{$value && !$parameter["shareLinkSettings"]?.password ? null : undefined}}',
			},
		},
	},
	{
		displayName: 'Remove Expiration',
		name: 'removeExpiration',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnlyForShareLinksUpdate },
		description: 'Whether to remove the expiration date. Ignored if an expiration is set above.',
		routing: {
			send: {
				type: 'body',
				property: 'expiresAt',
				value: '={{$value && !$parameter["shareLinkSettings"]?.expiresAt ? null : undefined}}',
			},
		},
	},
];
