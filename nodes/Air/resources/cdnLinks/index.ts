import type { INodeProperties } from 'n8n-workflow';

const showForCdnLinks = {
	resource: ['cdnLinks'],
};

const showOnlyForCdnLinksCreate = {
	resource: ['cdnLinks'],
	operation: ['create'],
};

const showOnlyForCdnLinksSetActive = {
	resource: ['cdnLinks'],
	operation: ['setActive'],
};

export const cdnLinksDescription: INodeProperties[] = [
	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showForCdnLinks },
		description: 'The ID of the asset the CDN link belongs to',
	},
	{
		displayName: 'Link Type',
		name: 'cdnLinkType',
		type: 'options',
		default: 'evergreen',
		displayOptions: { show: showOnlyForCdnLinksCreate },
		options: [
			{
				name: 'Evergreen',
				value: 'evergreen',
				description: 'Always serves the asset’s current default version',
			},
			{
				name: 'Version-Pinned',
				value: 'pinned',
				description: 'Serves one specific asset version',
			},
		],
		description: 'Whether the link follows the default version or is pinned to a version',
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
		name: 'cdnVersionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForCdnLinksCreate, cdnLinkType: ['pinned'] },
		},
		description: 'The ID of the asset version to pin the CDN link to',
		routing: {
			send: {
				type: 'body',
				property: 'versionId',
				value: '={{String($value || "").trim() !== "" ? String($value).trim() : undefined}}',
			},
		},
	},
	{
		displayName: 'CDN Link ID',
		name: 'cdnLinkId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForCdnLinksSetActive },
		description: 'The ID of the CDN link to activate or deactivate',
	},
	{
		displayName: 'Active',
		name: 'cdnLinkActive',
		type: 'boolean',
		default: true,
		displayOptions: { show: showOnlyForCdnLinksSetActive },
		description: 'Whether the CDN link is active and serving content',
		routing: {
			send: {
				type: 'body',
				property: 'active',
			},
		},
	},
];
