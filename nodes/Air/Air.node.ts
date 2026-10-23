import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
import { customFieldCreateDescription, customFieldUpdateDescription, customFieldValueCreateDescription, customFieldValueDeleteDescription } from './resources/customField';
import { tagsCreateDescription } from './resources/tags/create';
import { tagsGetDescription } from './resources/tags/get';
import { boardsCreateDescription } from './resources/boards/create';
import { boardsPatchDescription } from './resources/boards/patch';
import { boardsAddAssetsDescription } from './resources/boards/assetsAdd';
import { boardsUpdate } from './resources/boards/update';
import { uploadsInitiateDescription } from './resources/uploads/initiate';
import { uploadsCompleteDescription } from './resources/uploads/complete';
import { uploadsUploadPartDescription } from './resources/uploads/uploadPart';
import { assetsUpdate } from './resources/assets/update';
import { assetsGet } from './resources/assets/get';
import { assetsGetByIdDescription } from './resources/assets/getById';
import { assetsBoardsDescription } from './resources/assets/boards';
import { boardsGet } from './resources/boards/get';
import { boardsRemoveAssetDescription } from './resources/boards/assetsRemove';
import { importsCreateDescription } from './resources/imports/create';
import { importsGetStatusDescription } from './resources/imports/getStatus';

export class Air implements INodeType {
	description: INodeTypeDescription = {
        displayName: 'Air',
        name: 'air',
        icon: { light: 'file:./Air_Logo_light.svg', dark: 'file:./Air_Logo_dark.svg' },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Access, update, and manage assets, boards, custom fields, and tags in your Air workspace',
        usableAsTool: true,
        defaults: {
            name: 'Air',
        },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'airApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.air.inc/v1',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
		properties: [
            // Resources
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Asset',
                        value: 'assets',
                    },
                    {
                        name: 'Board',
                        value: 'boards',
                    },
                    {
                        name: "Custom Field",
                        value: 'customFields',
                    },
                    {
                        name: 'Import',
                        value: 'imports',
                    },
                    {
                        name: "Tag",
                        value: 'tags',
                    },
                    {
                        name: 'Upload',
                        value: 'uploads',
                    }
                ],
                default: 'assets',
            },
            // Operations
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'assets',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Apply Custom Field',
                        value: 'applyCustomField',
                        action: 'Apply custom field to asset',
                        description: 'Apply a custom field to an asset',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '={{`/assets/${String($parameter["assetId"] || "").trim()}/customfields/${String($parameter["customFieldId"] || "").trim()}`}}',
                            },
                        },
                    },
                    {
                        name: 'Apply Tag',
                        value: 'applyTag',
                        action: 'Apply tag to asset',
                        description: 'Apply a tag to an asset',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '={{`/assets/${String($parameter["assetId"] || "").trim()}/versions/${String($parameter["versionId"] || "").trim()}/tags`}}',
                            },
                        },
                    },
					{
						name: 'Get',
						value: 'get',
						action: 'Get air assets',
						description: 'Get Air assets',
						routing: {
							request: {
								method: 'GET',
								url: '/assets',
							},
						},
					},
					{
						name: 'Get by ID',
						value: 'getById',
						action: 'Get asset by id',
						description: 'Get a single asset by ID',
						routing: {
							request: {
								method: 'GET',
								url: '={{`/assets/${String($parameter["assetId"] || "").trim()}`}}',
							},
						},
					},
					{
						name: 'List Boards',
						value: 'listBoards',
						action: 'List parent boards',
						description: 'Get the list of parent boards of an asset',
						routing: {
							request: {
								method: 'GET',
								url: '={{`/assets/${String($parameter["assetId"] || "").trim()}/boards`}}',
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update air asset',
						description: 'Update an asset’s details',
						routing: {
							request: {
								method: 'PATCH',
								url: '={{`/assets/${String($parameter["assetId"] || "").trim()}/versions/${String($parameter["versionIdUpdate"] || "").trim()}`}}',
							},
						},
					},
                ],
                default: 'get',
            }, 
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'uploads',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Complete Upload',
                        value: 'completeUpload',
                        action: 'Complete upload',
                        description: 'Finalize multipart upload with part ETags',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/uploads/completeMultipart',
                            },
                        },
                    },
                    {
                        name: 'Initiate Upload',
                        value: 'initiateUpload',
                        action: 'Initiate upload',
                        description: 'Initiate multipart upload and get signed part URLs',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/uploads',
                            },
                        },
                    },
                    {
                        name: 'Upload Part',
                        value: 'uploadPart',
                        action: 'Get signed url for upload part',
                        description: 'Request a signed URL to upload a specific part',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/uploads/uploadPart',
                            },
                        },
                    },
                ],
                default: 'initiateUpload',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'boards',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Add Assets',
                        value: 'addAssets',
                        action: 'Add assets to board',
                        description: 'Associate one or more assets with a board',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '={{`/boards/${String($parameter["boardId"] || "").trim()}/assets`}}',
                            },
                        },
                    },
                    {
                        name: 'Apply Custom Field',
                        value: 'applyCustomField',
                        action: 'Apply custom field to board',
                        description: 'Set or unset custom field value(s) on a board',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '={{`/boards/${String($parameter["boardId"] || "").trim()}/customfields/${String($parameter["customFieldId"] || "").trim()}`}}',
                            },
                        },
                    },
                    {   
                        name: 'Create',
                        value: 'create',
                        action: 'Create air board',
                        description: 'Create Air Board',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/boards',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get air boards',
                        description: 'Get Air Boards',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/boards',
                            },
                        },
                    },
                    {
                        name: 'Remove Asset',
                        value: 'removeAsset',
                        action: 'Remove asset from board',
                        description: 'Remove an asset from a board',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '={{`/boards/${String($parameter["boardId"] || "").trim()}/assets/${String($parameter["assetId"] || "").trim()}`}}',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        action: 'Update air board',
                        description: 'Update a board’s title, description, or parent',
                        routing: {
                            request: {
                                method: 'PATCH',
                                url: '={{`/boards/${String($parameter["boardId"] || "").trim()}`}}',
                            },
                        },
                    },
                ],
                default: 'get',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'imports',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        action: 'Create import',
                        description: 'Import a new asset (or asset version) from a publicly accessible URL',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/imports',
                            },
                        },
                    },
                    {
                        name: 'Get Status',
                        value: 'getStatus',
                        action: 'Get import status',
                        description: 'Check the status of an import',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '={{`/imports/${String($parameter["importId"] || "").trim()}/status`}}',
                            },
                        },
                    },
                ],
                default: 'create',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'customFields',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Add Value',
                        value: 'addValue',
                        action: 'Add custom field value',
                        description: 'Add a new selectable value to a custom field',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '={{`/customFields/${String($parameter["customFieldId"] || "").trim()}/values`}}',
                            },
                        },
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        action: 'Create air custom field',
                        description: 'Create Air Custom Field',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/customFields',
                            },
                        },
                    },
                    {
                        name: 'Delete Value',
                        value: 'deleteValue',
                        action: 'Delete custom field value',
                        description: 'Delete a selectable value from a custom field',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '={{`/customFields/${String($parameter["customFieldId"] || "").trim()}/values/${String($parameter["valueId"] || "").trim()}`}}',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get air custom fields',
                        description: 'Get Air Custom Fields',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/customFields',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        action: 'Update air custom field',
                        description: 'Update an existing Air custom field',
                        routing: {
                            request: {
                                method: 'PATCH',
                                url: '={{`/customFields/${String($parameter["customFieldId"] || "").trim()}`}}',
                            },
                        },
                    },
                ],
                default: 'get',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'tags',
                        ],  
                    },
                },
                options: [
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get air tags',
                        description: 'Get Air Tags',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/tags',
                            },
                        },
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        action: 'Create air tag',
                        description: 'Create Air Tag',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/tags',
                            },
                        },
                    },
                ],
                default: 'get',
            },
            ...customFieldCreateDescription,
            ...customFieldUpdateDescription,
            ...customFieldValueCreateDescription,
            ...customFieldValueDeleteDescription,
            ...tagsCreateDescription,
            ...tagsGetDescription,
            ...boardsCreateDescription,
            ...boardsPatchDescription,
            ...boardsAddAssetsDescription,
            ...boardsUpdate,
            ...uploadsInitiateDescription,
            ...uploadsUploadPartDescription,
            ...uploadsCompleteDescription,
            ...assetsUpdate,
            ...assetsGet,
            ...assetsGetByIdDescription,
            ...assetsBoardsDescription,
            ...boardsGet,
            ...boardsRemoveAssetDescription,
            ...importsCreateDescription,
            ...importsGetStatusDescription,
		]
	};
}