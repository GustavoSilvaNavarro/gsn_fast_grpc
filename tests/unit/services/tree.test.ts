// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import type { SingleNode, TreeNodeResponse } from '@interfaces';
// import { expectedMockTree, listOfNodes, mockPayload, rootNodePayload } from '@mocks';
// import { BadRequestError } from '@server/errors';

// const mockNodeModel = {
//   findByPk: jest.fn(),
//   create: jest.fn(),
// };

// const mockSequelizeInstance = {
//   query: jest.fn(),
// };

// jest.mock('@adapters/db/models', () => ({ Node: mockNodeModel }));
// jest.mock('@adapters/db', () => ({ sequelize: mockSequelizeInstance }));

// import { buildNodeMap, buildTreeFromMap, createNewNode, getAllTrees, queryNodes } from '@services';

// describe('Tree Services tests', () => {
//   const ROOT_KEY = 'root';
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('createNewNode', () => {
//     test('Should insert new root node when there is no parentId in the payload.', async () => {
//       const now = new Date();
//       const nodeMock = { ...rootNodePayload, id: 1, createdAt: now, updatedAt: now };
//       mockNodeModel.create.mockResolvedValueOnce(nodeMock);

//       const newNode = await createNewNode(rootNodePayload);

//       expect(newNode).toEqual(nodeMock);
//       expect(mockNodeModel.create).toHaveBeenCalledTimes(1);
//       expect(mockNodeModel.create).toHaveBeenCalledWith(rootNodePayload);
//       expect(mockNodeModel.findByPk).not.toHaveBeenCalled();
//     });

//     test('Should insert new child node when parentId is found in the db', async () => {
//       const now = new Date();
//       const parentMock = { ...rootNodePayload, id: 1, createdAt: now, updatedAt: now };
//       const mockNewNode = { ...mockPayload, id: 2, createdAt: now, updatedAt: now };
//       mockNodeModel.findByPk.mockResolvedValueOnce(parentMock);
//       mockNodeModel.create.mockResolvedValueOnce(mockNewNode);

//       const newNode = await createNewNode(mockPayload);

//       expect(newNode).toEqual(mockNewNode);
//       expect(mockNodeModel.create).toHaveBeenCalledTimes(1);
//       expect(mockNodeModel.create).toHaveBeenCalledWith(mockPayload);
//       expect(mockNodeModel.findByPk).toHaveBeenCalledTimes(1);
//       expect(mockNodeModel.findByPk).toHaveBeenCalledWith(mockPayload.parentId);
//     });

//     test('Should not create a new child node and throw an error when parent not is not found in the db', async () => {
//       mockNodeModel.findByPk.mockResolvedValueOnce(null);

//       await expect(createNewNode(mockPayload)).rejects.toThrow(BadRequestError);
//       expect(mockNodeModel.create).toHaveBeenCalledTimes(0);
//       expect(mockNodeModel.findByPk).toHaveBeenCalledTimes(1);
//       expect(mockNodeModel.findByPk).toHaveBeenCalledWith(mockPayload.parentId);
//     });
//   });

//   describe('queryNodes', () => {
//     test('Should return a list of sorted nodes.', async () => {
//       mockSequelizeInstance.query.mockResolvedValueOnce(listOfNodes);

//       const nodes = await queryNodes();

//       expect(nodes).toEqual(listOfNodes);
//       expect(mockSequelizeInstance.query).toHaveBeenCalledTimes(1);
//     });
//   });

//   describe('buildNodeMap', () => {
//     test('Should correctly build a node map for a single tree', () => {
//       const flatNodes: Array<SingleNode> = [
//         { id: 1, label: 'root', parent_id: null },
//         { id: 2, label: 'child', parent_id: 1 },
//       ];

//       const expectedMap = new Map<number | string, Array<TreeNodeResponse>>();
//       expectedMap.set(ROOT_KEY, [{ id: 1, label: 'root', children: [] }]);
//       expectedMap.set(1, [{ id: 2, label: 'child', children: [] }]);

//       const resultMap = buildNodeMap(flatNodes);

//       expect(resultMap).toEqual(expectedMap);
//     });

//     test('Should correctly handle multiple independent trees', () => {
//       const flatNodes: Array<SingleNode> = [
//         { id: 10, label: 'root A', parent_id: null },
//         { id: 11, label: 'child A', parent_id: 10 },
//         { id: 20, label: 'root B', parent_id: null },
//         { id: 21, label: 'child B', parent_id: 20 },
//       ];

//       const expectedMap = new Map<number | string, Array<TreeNodeResponse>>();
//       expectedMap.set(ROOT_KEY, [
//         { id: 10, label: 'root A', children: [] },
//         { id: 20, label: 'root B', children: [] },
//       ]);
//       expectedMap.set(10, [{ id: 11, label: 'child A', children: [] }]);
//       expectedMap.set(20, [{ id: 21, label: 'child B', children: [] }]);

//       const resultMap = buildNodeMap(flatNodes);

//       expect(resultMap).toEqual(expectedMap);
//     });

//     test('Should correctly build a map for a deeply nested tree', () => {
//       const flatNodes: Array<SingleNode> = [
//         { id: 1, label: 'root', parent_id: null },
//         { id: 2, label: 'bear', parent_id: 1 },
//         { id: 3, label: 'cat', parent_id: 2 },
//         { id: 4, label: 'frog', parent_id: 1 },
//       ];

//       const expectedMap = new Map<number | string, Array<TreeNodeResponse>>();
//       expectedMap.set(ROOT_KEY, [{ id: 1, label: 'root', children: [] }]);
//       expectedMap.set(1, [
//         { id: 2, label: 'bear', children: [] },
//         { id: 4, label: 'frog', children: [] },
//       ]);
//       expectedMap.set(2, [{ id: 3, label: 'cat', children: [] }]);

//       const resultMap = buildNodeMap(flatNodes);

//       expect(resultMap).toEqual(expectedMap);
//     });

//     test('Should return an empty map for an empty input array', () => {
//       const flatNodes: Array<SingleNode> = [];
//       const expectedMap = new Map<number | string, Array<TreeNodeResponse>>();

//       const resultMap = buildNodeMap(flatNodes);

//       expect(resultMap).toEqual(expectedMap);
//     });

//     test('Should handle only root nodes correctly', () => {
//       const flatNodes: Array<SingleNode> = [
//         { id: 1, label: 'root 1', parent_id: null },
//         { id: 2, label: 'root 2', parent_id: null },
//       ];

//       const expectedMap = new Map<number | string, TreeNodeResponse[]>();
//       expectedMap.set(ROOT_KEY, [
//         { id: 1, label: 'root 1', children: [] },
//         { id: 2, label: 'root 2', children: [] },
//       ]);

//       const resultMap = buildNodeMap(flatNodes);

//       expect(resultMap).toEqual(expectedMap);
//     });
//   });

//   describe('buildTreeFromMap', () => {
//     test('Should correctly build a single nested tree', () => {
//       const flatNodes: Array<SingleNode> = [
//         { id: 1, label: 'root', parent_id: null },
//         { id: 2, label: 'child', parent_id: 1 },
//       ];
//       const mockNodeMap = buildNodeMap(flatNodes);

//       const expectedTree: TreeNodeResponse[] = [
//         {
//           id: 1,
//           label: 'root',
//           children: [{ id: 2, label: 'child', children: [] }],
//         },
//       ];

//       const initialNodeList = mockNodeMap.get(ROOT_KEY) ?? [];
//       const resultTree = buildTreeFromMap(initialNodeList, mockNodeMap);

//       expect(resultTree).toEqual(expectedTree);
//     });

//     test('Should correctly build a deeply nested tree', () => {
//       const flatNodes: Array<SingleNode> = [
//         { id: 1, label: 'root', parent_id: null },
//         { id: 2, label: 'bear', parent_id: 1 },
//         { id: 3, label: 'cat', parent_id: 2 },
//         { id: 4, label: 'frog', parent_id: 1 },
//       ];
//       const mockNodeMap = buildNodeMap(flatNodes);

//       const expectedTree: TreeNodeResponse[] = [
//         {
//           id: 1,
//           label: 'root',
//           children: [
//             {
//               id: 2,
//               label: 'bear',
//               children: [
//                 {
//                   id: 3,
//                   label: 'cat',
//                   children: [],
//                 },
//               ],
//             },
//             {
//               id: 4,
//               label: 'frog',
//               children: [],
//             },
//           ],
//         },
//       ];

//       const initialNodeList = mockNodeMap.get(ROOT_KEY)!;
//       const resultTree = buildTreeFromMap(initialNodeList, mockNodeMap);

//       expect(resultTree).toEqual(expectedTree);
//     });

//     test('Should correctly handle multiple independent trees', () => {
//       const flatNodes: Array<SingleNode> = [
//         { id: 10, label: 'root A', parent_id: null },
//         { id: 11, label: 'child A', parent_id: 10 },
//         { id: 20, label: 'root B', parent_id: null },
//         { id: 21, label: 'child B', parent_id: 20 },
//       ];
//       const mockNodeMap = buildNodeMap(flatNodes);

//       const expectedTree: TreeNodeResponse[] = [
//         {
//           id: 10,
//           label: 'root A',
//           children: [{ id: 11, label: 'child A', children: [] }],
//         },
//         {
//           id: 20,
//           label: 'root B',
//           children: [{ id: 21, label: 'child B', children: [] }],
//         },
//       ];

//       const initialNodeList = mockNodeMap.get(ROOT_KEY)!;
//       const resultTree = buildTreeFromMap(initialNodeList, mockNodeMap);

//       expect(resultTree).toEqual(expectedTree);
//     });

//     test('Should return an empty array when the initial list is empty', () => {
//       const mockMap = new Map<number | string, TreeNodeResponse[]>();
//       const initialNodeList: TreeNodeResponse[] = [];

//       const resultTree = buildTreeFromMap(initialNodeList, mockMap);

//       expect(resultTree).toEqual([]);
//     });

//     test('Should handle a single root node with no children', () => {
//       const flatNodes: Array<SingleNode> = [{ id: 1, label: 'root', parent_id: null }];
//       const mockNodeMap = buildNodeMap(flatNodes);

//       const initialNodeList = mockNodeMap.get(ROOT_KEY)!;
//       const resultTree = buildTreeFromMap(initialNodeList, mockNodeMap);

//       expect(resultTree).toEqual([{ id: 1, label: 'root', children: [] }]);
//     });
//   });

//   describe('getAllTrees', () => {
//     test('Should return all nested trees with its children', async () => {
//       mockSequelizeInstance.query.mockResolvedValueOnce(listOfNodes);

//       const trees = await getAllTrees();

//       expect(trees).toEqual(expectedMockTree);
//     });

//     test('Should return an empty list when there is no nodes in the db', async () => {
//       mockSequelizeInstance.query.mockResolvedValueOnce([]);

//       const trees = await getAllTrees();

//       expect(trees).toEqual([]);
//     });

//     test('Should return root nodes only', async () => {
//       const mockListNodes = [
//         { id: 1, label: 'root', parent_id: null },
//         { id: 2, label: 'root2', parent_id: null },
//       ];
//       mockSequelizeInstance.query.mockResolvedValueOnce(mockListNodes);

//       const trees = await getAllTrees();

//       expect(trees).toEqual([
//         { id: 1, label: 'root', children: [] },
//         { id: 2, label: 'root2', children: [] },
//       ]);
//     });
//   });
// });
