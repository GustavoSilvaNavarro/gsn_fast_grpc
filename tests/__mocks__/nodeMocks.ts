export const mockPayload = {
  label: 'bear',
  parentId: 1,
};

export const invalidMockPayload = {
  parentId: 6,
};

export const rootNodePayload = {
  label: 'root',
};

export const listOfNodes = [
  { id: 1, label: 'root', parent_id: null },
  { id: 2, label: 'bear', parent_id: 1 },
  { id: 3, label: 'cat', parent_id: 2 },
  { id: 4, label: 'frog', parent_id: 1 },
  { id: 5, label: 'root2', parent_id: null },
  { id: 6, label: 'John', parent_id: 5 },
  { id: 8, label: 'Liam', parent_id: 6 },
  { id: 7, label: 'Lia', parent_id: 5 },
];

export const expectedMockTree = [
  {
    id: 1,
    label: 'root',
    children: [
      {
        id: 2,
        label: 'bear',
        children: [
          {
            id: 3,
            label: 'cat',
            children: [],
          },
        ],
      },
      {
        id: 4,
        label: 'frog',
        children: [],
      },
    ],
  },
  {
    id: 5,
    label: 'root2',
    children: [
      {
        id: 6,
        label: 'John',
        children: [
          {
            id: 8,
            label: 'Liam',
            children: [],
          },
        ],
      },
      {
        id: 7,
        label: 'Lia',
        children: [],
      },
    ],
  },
];

export const seeData = [
  { id: 1, label: 'root' },
  { id: 2, label: 'bear', parentId: 1 },
  { id: 3, label: 'cat', parentId: 2 },
  { id: 4, label: 'frog', parentId: 1 },
  { id: 5, label: 'root2' },
  { id: 6, label: 'John', parentId: 5 },
  { id: 8, label: 'Liam', parentId: 6 },
  { id: 7, label: 'Lia', parentId: 5 },
];
