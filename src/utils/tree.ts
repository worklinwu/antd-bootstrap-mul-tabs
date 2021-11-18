/* eslint-disable no-unused-vars,no-param-reassign,no-underscore-dangle */
import { cloneDeep } from 'lodash';

export type TreeLikeArrayItem = Record<string, any>;
export type TreeLikeArray = TreeLikeArrayItem[];

export type TreeNode = Record<string, any> & { children?: Tree };
export type Tree = TreeNode[] | TreeNode;

export interface TreeNodeFieldAlias {
  idKey?: string;
  parentIdKey?: string;
  childrenKey?: string;
}

export interface TreePathOptions {
  pathSeparator?: string;
  fieldName?: string;
  childrenKey?: string;
}

export interface TraverseOptions {
  some?: boolean;
  every?: boolean;
  returnBoolean?: boolean;
  returnArray?: boolean;
}

export enum TraverseType {
  Depth = 'depth',
  Breath = 'breath',
}

/**
 * 将List结构的对象数组转化为树形结构
 * @param array {Array<TreeLikeArrayItem>} 源数据
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function createTreeFromTreeLikeArray(array: TreeLikeArray, options?: TreeNodeFieldAlias): TreeLikeArray {
  const { idKey = 'id', parentIdKey = 'pId', childrenKey = 'children' } = options || {};
  const idMapTemp = Object.create(null);
  const cloneData: typeof array = cloneDeep(array);
  cloneData.forEach((row: TreeLikeArrayItem): void => {
    idMapTemp[row[idKey]] = row;
  });
  const result: TreeLikeArray = [];
  cloneData.forEach((row: TreeLikeArrayItem): void => {
    const parent = idMapTemp[row[parentIdKey]];
    if (parent) {
      const v = parent[childrenKey] || (parent[childrenKey] = []);
      v.push(row);
    } else {
      result.push(row);
    }
  });
  return result;
}

/**
 * 过滤树数据. 如果子节点有匹配数据, 会连带父节点一起返回
 * @param array 要过滤的数组数据
 * @param predicate 过滤函数
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function filterTreeArray(
  array: TreeLikeArray,
  predicate: (item: TreeLikeArrayItem) => boolean,
  options?: TreeNodeFieldAlias,
): TreeLikeArray {
  const { idKey = 'id', parentIdKey = 'pId' } = options || {};
  const result: TreeLikeArray = array.filter(predicate);
  const needCheekPidArr = [...result];
  // 查找父级
  while (needCheekPidArr.length) {
    // 从末尾截取一个节点, (从末尾是因为 array 大概率是排序过的数据, 从末尾查找速度快)
    const currentItemTemp: TreeLikeArrayItem = needCheekPidArr.splice(needCheekPidArr.length - 1, 1);
    const currentItem = currentItemTemp && currentItemTemp.length && currentItemTemp[0];
    if (currentItem[parentIdKey]) {
      // 判断是否有父节点, 有父节点把父节点找出来添加进结果中
      const parentItem = array.filter((item: TreeLikeArrayItem): boolean => item[idKey] === currentItem[parentIdKey]);
      if (
        parentItem.length &&
        !result.some((item: TreeLikeArrayItem): boolean => item[idKey] === parentItem[0][idKey])
      ) {
        result.unshift(parentItem[0]);
        // 重新丢回队列, 去查找父级的父级
        needCheekPidArr.push(parentItem[0]);
      }
    }
  }
  return result;
}

/**
 * 向上查找所有父节点, 返回节点的数组
 * @param array 数组类型数据
 * @param node 要查找的节点
 * @param depth 遍历的深度
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function closestParentItemInTreeArray(
  array: TreeLikeArray,
  node: TreeLikeArrayItem,
  depth: false | number = false,
  options?: TreeNodeFieldAlias,
): TreeLikeArray {
  const { idKey = 'id', parentIdKey = 'pId' } = options || {};
  const result: TreeLikeArray = [];
  let currentItem: TreeLikeArrayItem | undefined = node;
  let deepLoopCount = typeof depth === 'number' ? depth : Infinity;
  const findItem: () => TreeLikeArrayItem | undefined = () => {
    const pId = currentItem?.[parentIdKey];
    if (pId) {
      return array.find((item: TreeLikeArrayItem) => item[idKey] === pId);
    }
    return undefined;
  };
  do {
    currentItem = findItem();
    if (currentItem) {
      result.unshift(currentItem);
    }
    deepLoopCount -= 1;
  } while (currentItem && currentItem[parentIdKey] && deepLoopCount > 0);
  return result;
}

/**
 * 向上查找所有父节点 key 值, 返回 key 值的数组
 * @param array 数组类型数据
 * @param key 要查找的节点
 * @param depth 遍历的深度
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function closestParentKeysInTreeArray(
  array: TreeLikeArray,
  key: keyof any,
  depth: false | number = false,
  options?: TreeNodeFieldAlias,
): string[] {
  const { idKey = 'id', parentIdKey = 'pId' } = options || {};
  const result: string[] = [];
  let currentItem: TreeLikeArrayItem | undefined = array.find((item: TreeLikeArrayItem) => item[idKey] === key);
  let deepLoopCount: number = typeof depth === 'number' ? depth : Infinity;
  if (!currentItem) {
    return result;
  }
  const findItem: () => TreeLikeArrayItem | undefined = () => {
    const pId = currentItem?.[parentIdKey];
    if (pId) {
      return array.find((item: TreeLikeArrayItem) => item[idKey] === pId);
    }
    return undefined;
  };
  do {
    currentItem = findItem();
    if (currentItem) {
      result.unshift(currentItem[idKey]);
    }
    deepLoopCount -= 1;
  } while (currentItem && currentItem[parentIdKey] && deepLoopCount > 0);
  return result;
}

/**
 * 向下查找所有子节点, 返回节点的数组
 * @param array 数组类型数据
 * @param targetNode 要查找的节点
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function findChildrenItemInTreeArray(
  array: TreeLikeArray,
  targetNode: TreeLikeArrayItem,
  options?: TreeNodeFieldAlias,
): TreeLikeArray {
  const { idKey = 'id', parentIdKey = 'pId' } = options || {};
  const result: TreeLikeArray = [];
  const findChildren = (pId: keyof any) => array.filter((item: TreeLikeArrayItem) => item[parentIdKey] === pId);
  let queue: TreeLikeArray = findChildren(targetNode[idKey]);
  while (queue.length) {
    const currentItem: TreeLikeArrayItem | undefined = queue.shift();
    if (currentItem) {
      const children = findChildren(currentItem[idKey]);
      result.push(currentItem);
      queue = queue.concat(children);
    }
  }
  return result;
}

/**
 * 判断是否有子节点
 * @param array 数组类型数据
 * @param targetNode 要查找的节点
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function hasChildrenNode(
  array: TreeLikeArray,
  targetNode: TreeLikeArrayItem,
  options?: TreeNodeFieldAlias,
): boolean {
  const { idKey = 'id', parentIdKey = 'pId' } = options || {};
  return array.some((item: TreeLikeArrayItem) => item[parentIdKey] === targetNode[idKey]);
}

function _normalizeObjectPath(path: string | string[]): string[] {
  if (path instanceof Array) return path;
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter((p) => p !== '');
}

function _normalizeTreePath(path: string | string[], pathSeparator: string, childrenKey: string): string[] {
  if (path instanceof Array) return path;
  const fullChildren = new RegExp(childrenKey, 'gi');
  return path
    .replace(fullChildren, '')
    .replace(/\[(\d+)]/g, '.$1')
    .split(pathSeparator)
    .filter((p) => p !== '');
}

/**
 * 按路径查找目标值
 * @param {object} tree
 * @param {string|string[]} path
 * @param {TreePathOptions} [options]
 * @returns {*}
 *
 * @example
 *   path = ''                 return treeRoot
 *   path = 'child1'           return treeRoot.children[title === 'child1']
 *   path = 'children[1]'      return treeRoot.children[1]
 *   path = 'child1.child11'   return treeRoot.children[title === 'child1'].children[title === 'child11']
 *   path = 'child1[0]'        return treeRoot.children[title === 'child1'].children[0]
 */
export function getTreeNodeByPath(tree: TreeNode, path: string, options: TreePathOptions = {}): unknown {
  const { pathSeparator = '.', fieldName = 'title', childrenKey = 'children' } = options || {};

  const pathNodes = _normalizeTreePath(path, pathSeparator, childrenKey);
  return pathNodes.reduce((branch, pathPart) => {
    if (!branch) return branch;
    const children = branch[childrenKey] || [];
    // eslint-disable-next-line no-restricted-globals
    const childIndex = isFinite(Number(pathPart))
      ? pathPart
      : children.findIndex((node: TreeNode) => node[fieldName] === pathPart);
    return children[childIndex];
  }, tree);
}

/**
 * 模拟 lodash.get, 但是没有默认值的参数
 * @param tree 树数据
 * @param path 路径
 */
export function getFromTree(tree: Tree, path: string | string[]): unknown {
  const pathArray = _normalizeObjectPath(path);
  return pathArray.reduce((node: TreeNode, pathPart: string | number) => {
    if (!node) return node;
    return node[pathPart];
  }, tree);
}

/**
 * 模拟 lodash.set
 * @param tree 树数据
 * @param path 路径
 * @param value 要设置的值
 */
export function setToTree(tree: Tree, path: string | string[], value: unknown): Tree {
  const pathArray = _normalizeObjectPath(path);
  pathArray.reduce((node: TreeNode, pathPart: string | number, index: number, arr: Tree) => {
    if (index + 1 === arr.length) {
      // eslint-disable-next-line no-param-reassign
      node[pathPart] = value;
      return;
    }
    // eslint-disable-next-line consistent-return
    if (node[pathPart]) return node[pathPart];
    // eslint-disable-next-line consistent-return,no-restricted-globals,no-return-assign
    return (node[pathPart] = isFinite(Number((arr as TreeNode[])[index + 1])) ? [] : {});
  }, cloneDeep(tree));
  return tree;
}

/**
 * 扁平化树结构
 * @param tree 树结构数据
 * @param keepChildrenField 是否保留 children 字段
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function flattenTree(tree: Tree, keepChildrenField = false, options?: TreeNodeFieldAlias): TreeNode[] {
  const treeDataClone = tree ? cloneDeep(tree) : null;
  const { childrenKey = 'children' } = options || {};
  const result: TreeNode[] = [];
  const deep = (data: TreeNode[]) => {
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      result.push(node);
      if (node[childrenKey]) {
        deep(node[childrenKey]);
        if (!keepChildrenField) {
          delete node[childrenKey];
        }
      }
    }
  };
  if (tree instanceof Array) {
    deep(treeDataClone as TreeNode[]);
  } else if (treeDataClone) {
    deep([treeDataClone]);
  }
  return result;
}

/**
 * 遍历树数据的方法
 * @param tree 树数据
 * @param fn 遍历函数
 * @param queueMethod shift: 深度优先 | unshift: 广度优先
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
// eslint-disable-next-line consistent-return
function _traverse(
  tree: Tree,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  fn: (node: TreeNode, options?: TraverseOptions & TreePathOptions) => boolean | undefined | void,
  queueMethod: 'push' | 'unshift',
  options?: TraverseOptions & TreePathOptions,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): Tree | TreeNode | TreeNode[] | boolean | void {
  const { some, every, returnBoolean, returnArray, childrenKey = 'children' } = options || {};
  const queue: TreeNode[] = tree instanceof Array ? [...tree] : [{ ...tree }];
  const results: Tree = [];
  let didBreak = false;
  let lastResult: boolean | undefined;
  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (node[childrenKey] && node[childrenKey].length) {
      // 广度优先还是深度优先
      queue[queueMethod](...node[childrenKey]);
    }
    if (some || every) {
      const result = fn(node, options);
      if (returnArray) {
        if (result) {
          results.push(node);
        }
      } else if ((every && !result) || (some && result)) {
        didBreak = true;
        lastResult = result || undefined;
        break;
      }
    } else if (fn(node, options) === false) {
      break;
    }
  }
  if (every) {
    if (returnBoolean) {
      return !didBreak;
    }
    if (returnArray) {
      return results;
    }
  } else if (some) {
    if (returnBoolean) {
      return Boolean(lastResult);
    }
    if (returnArray) {
      return results;
    }
  }
}

/**
 * 遍历树数据
 * @param tree 树数据
 * @param callbackFn 遍历函数
 * @param traverseType 遍历方式, 默认是广度优先
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function traverseTree(
  tree: Tree,
  callbackFn: (node: TreeNode) => void,
  traverseType: TraverseType | string = TraverseType.Breath,
  options?: TreePathOptions,
): void {
  _traverse(tree, callbackFn, traverseType === TraverseType.Depth ? 'unshift' : 'push', options);
}

/**
 * 遍历树数据, 如果有一个节点匹配, 则返回 true
 * @param tree 树数据
 * @param predicate 遍历函数
 * @param traverseType 遍历方式
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function someTree(
  tree: Tree,
  predicate: (node: TreeNode) => boolean,
  traverseType: TraverseType | string = TraverseType.Breath,
  options?: TreePathOptions,
): boolean {
  return _traverse(tree, predicate, traverseType === TraverseType.Depth ? 'unshift' : 'push', {
    ...options,
    some: true,
    returnBoolean: true,
  }) as boolean;
}

/**
 * 遍历树数据, 所有的节点都匹配, 则返回 true
 * @param tree 树数据
 * @param predicate 遍历函数
 * @param traverseType 遍历方式
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function everyTree(
  tree: Tree,
  predicate: (node: TreeNode) => boolean,
  traverseType: TraverseType | string = TraverseType.Breath,
  options?: TreePathOptions,
): boolean {
  return _traverse(tree, predicate, traverseType === TraverseType.Depth ? 'unshift' : 'push', {
    ...options,
    every: true,
    returnBoolean: true,
  }) as boolean;
}

/**
 * 查找树数据, 所有第一个匹配的节点
 * @param tree 树数据
 * @param predicate 遍历函数
 * @param traverseType 遍历方式 breath|depth, 默认 breath (广度优先)
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function findOneInTree(
  tree: Tree,
  predicate: (node: TreeNode) => boolean,
  traverseType: TraverseType | string = TraverseType.Breath,
  options?: TreePathOptions,
): TreeNode | null {
  return (
    (
      _traverse(tree, predicate, traverseType === TraverseType.Depth ? 'unshift' : 'push', {
        ...options,
        some: true,
        returnArray: true,
      }) as TreeNode[]
    )?.[0] ?? null
  );
}

/**
 * 查找树数据, 返回所有匹配的数据
 * @param tree 树数据
 * @param predicate 遍历函数
 * @param traverseType 遍历方式 breath|depth, 默认 breath (广度优先)
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function findAllInTree(
  tree: Tree,
  predicate: (node: TreeNode) => boolean,
  traverseType: TraverseType = TraverseType.Breath,
  options?: TreePathOptions,
): TreeNode[] {
  return (
    (_traverse(tree, predicate, traverseType === TraverseType.Depth ? 'unshift' : 'push', {
      ...options,
      every: true,
      returnArray: true,
    }) as TreeNode[]) ?? []
  );
}

/**
 * 查找父节点
 * @param tree 树结构数据
 * @param targetNode 目标节点
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function findParentTreeNode(tree: Tree, targetNode: TreeNode, options?: TreeNodeFieldAlias): TreeNode | null {
  const { idKey = 'id', parentIdKey = 'pId' } = options || {};
  if (targetNode[parentIdKey]) {
    return findOneInTree(
      tree,
      (node: TreeNode) => node[idKey] === targetNode[parentIdKey],
      TraverseType.Breath,
      options,
    );
  }
  return null;
}

/**
 * 获取目标节点所在兄弟节点中的索引
 * @param tree 树数据
 * @param targetNode 目标节点
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function findIndexInSiblingNode(tree: Tree, targetNode: TreeNode, options?: TreeNodeFieldAlias): number {
  const { idKey = 'id', childrenKey = 'children' } = options || {};
  const parentNode = findParentTreeNode(tree, targetNode, options);
  if (parentNode) {
    return parentNode ? parentNode[childrenKey].findIndex((node: TreeNode) => node[idKey] === targetNode[idKey]) : -1;
  }
  return 0;
}

/**
 * 遍历树类型数据, 并返回新的对象
 * @param tree 树数据
 * @param callbackFn 遍历函数
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function mapTree(tree: Tree, callbackFn: (node: TreeNode) => TreeNode, options?: TreeNodeFieldAlias): Tree {
  const { childrenKey = 'children' } = options || {};
  const treeClone = tree instanceof Array ? cloneDeep(tree) : [cloneDeep(tree)];
  return treeClone.map((item: TreeNode) => {
    if (item[childrenKey]) {
      item[childrenKey] = mapTree(item[childrenKey], callbackFn, options);
    }
    return callbackFn(item);
  });
}

/**
 * 遍历树类型数据
 * @param tree
 * @param compareFn
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function sortTree(
  tree: Tree,
  compareFn: (a: TreeNode, b: TreeNode) => number,
  options?: TreeNodeFieldAlias,
): Tree {
  const { childrenKey = 'children' } = options || {};
  let treeClone = tree instanceof Array ? cloneDeep(tree) : [cloneDeep(tree)];
  treeClone = treeClone.map((item: TreeNode) => {
    if (item[childrenKey]) {
      item[childrenKey] = sortTree(item[childrenKey], compareFn, options);
    }
    return item;
  });
  return treeClone.sort(compareFn);
}

/**
 * 替换树节点数据
 * @param tree 树类型数据
 * @param predicate 匹配的方法
 * @param replaceNode 要替换的值
 * @returns {[]}
 */
export function replaceTreeNode(
  tree: Tree,
  predicate: (node: TreeNode) => boolean,
  replaceNode: ((node: TreeNode) => TreeNode) | TreeNode,
): Tree {
  return mapTree(tree, (node) => {
    if (predicate(node)) {
      if (replaceNode instanceof Function) {
        return replaceNode(node);
      }
      return replaceNode;
    }
    return node;
  });
}

/**
 * 删除空的 children 节点
 * @param tree 树类型数据
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function removeEmptyChildrenTreeNode(tree: Tree, options?: TreeNodeFieldAlias): Tree {
  const { childrenKey = 'children' } = options || {};
  return mapTree(tree, (node) => {
    if (Array.isArray(node[childrenKey]) && node[childrenKey].length) {
      node[childrenKey] = removeEmptyChildrenTreeNode(node[childrenKey], options);
    } else if (node[childrenKey]) {
      delete node[childrenKey];
    }
    return node;
  });
}

/**
 * 统计所有节点的子节点的数量
 * @param tree 树类型数据
 * @param deep 是否统计所有子节点
 * @param statisticsKey 统计好的数字保存在哪个字段
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function statisticsTreeNodeChildren(
  tree: Tree,
  deep = false,
  statisticsKey = 'statistics',
  options?: TreeNodeFieldAlias,
): Tree {
  const { childrenKey = 'children' } = options || {};
  return mapTree(tree, (node) => {
    if (node[childrenKey] && node[childrenKey].length) {
      if (deep) {
        node[statisticsKey] = node[childrenKey].reduce(
          (prev: number, child: TreeNode) => prev + (child[statisticsKey] as number) || 0,
          0,
        );
        node[statisticsKey] += node[childrenKey].length;
      } else {
        node[statisticsKey] = node[childrenKey].length;
      }
    }
    return node;
  });
}

/**
 * 向上查找所有父节点
 * @param tree 树数据
 * @param predicate 查找的节点的方法
 * @param isContainerTarget 是否包含匹配的节点
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function closestParentItemInTree(
  tree: Tree,
  predicate: (node: TreeNode) => boolean,
  isContainerTarget = false,
  options?: TreeNodeFieldAlias,
): TreeNode[] {
  const { childrenKey = 'children' } = options || {};
  const result: TreeNode[] = [];
  const traverseFn: (node: TreeNode) => boolean = (node) => {
    let hasExist = false;
    if (node[childrenKey] && node[childrenKey].length) {
      hasExist = node[childrenKey].filter((childrenNode: TreeNode) => traverseFn(childrenNode)).length > 0;
    }
    if (hasExist) {
      result.unshift(node);
      return true;
    }
    const matchResult = predicate(node);
    if (matchResult && isContainerTarget) {
      result.unshift(node);
    }
    return matchResult;
  };
  if (tree instanceof Array) {
    tree.forEach((item) => traverseFn(item));
  } else {
    traverseFn(tree);
  }
  return result;
}

/**
 * 过滤树类型数据, 保留匹配节点的父级
 * @param tree 树数据
 * @param predicate 匹配的方法
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 * @returns {*}
 */
export function filterTree(tree: Tree, predicate: (node: TreeNode) => boolean, options?: TreeNodeFieldAlias): Tree {
  const { childrenKey = 'children' } = options || {};
  return cloneDeep(tree).filter((child: TreeNode) => {
    if (child[childrenKey]) {
      child[childrenKey] = filterTree(child[childrenKey], predicate, options);
      // 如果子节点有匹配的结果, 就直接返回父节点
      if (child[childrenKey] && child[childrenKey].length) {
        return child;
      }
    }
    return predicate(child);
  });
}

/**
 * 为没有父节点的树数据添加父节点
 * @param tree
 * @param options 别名配置, 默认值为 { idKey: 'id', parentIdKey: 'pId', childrenKey: 'children' }
 */
export function completionTreeNodePid(tree: Tree, options?: TreeNodeFieldAlias): Tree {
  const { idKey = 'id', parentIdKey = 'pId', childrenKey = 'children' } = options || {};
  const treeDataClone = cloneDeep(tree) as TreeNode[];
  for (let i = 0; i < treeDataClone.length; i += 1) {
    treeDataClone[i][childrenKey] = completionTreeNodePid(
      treeDataClone[i][childrenKey] &&
        treeDataClone[i][childrenKey].length &&
        treeDataClone[i][childrenKey].map((item: TreeNode) => ({
          ...item,
          [parentIdKey]: item[parentIdKey] || treeDataClone[i][idKey],
        })),
    );
  }
  return treeDataClone;
}

/**
 * 获取目标节点的右侧节点
 * @param tree 树数据
 * @param targetNode 目标节点
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function getRightNode(tree: Tree, targetNode: TreeNode, options?: TreeNodeFieldAlias): TreeNode | null {
  const { idKey = 'id', childrenKey = 'children' } = options || {};
  const parentNode = findParentTreeNode(tree, targetNode, options);
  if (parentNode) {
    const targetIndex: number = parentNode
      ? parentNode[childrenKey].findIndex((node: TreeNode) => node[idKey] === targetNode[idKey])
      : -1;
    return parentNode[childrenKey].slice(targetIndex + 1, targetIndex + 2)?.[0];
  }
  return null;
}

/**
 * 获取目标节点的所有右侧节点
 * @param tree 树数据
 * @param targetNode 目标节点
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function getAllRightNode(tree: Tree, targetNode: TreeNode, options?: TreeNodeFieldAlias): TreeNode[] {
  const { idKey = 'id', childrenKey = 'children' } = options || {};
  const parentNode = findParentTreeNode(tree, targetNode, options);
  if (parentNode) {
    const targetIndex: number = parentNode
      ? parentNode[childrenKey].findIndex((node: TreeNode) => node[idKey] === targetNode[idKey])
      : -1;
    return parentNode[childrenKey].slice(targetIndex + 1);
  }
  return [];
}

/**
 * 获取目标节点的左侧节点
 * @param tree 树数据
 * @param targetNode 目标节点
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function getLeftNode(tree: Tree, targetNode: TreeNode, options?: TreeNodeFieldAlias): TreeNode | null {
  const { idKey = 'id', childrenKey = 'children' } = options || {};
  const parentNode = findParentTreeNode(tree, targetNode, options);
  if (parentNode) {
    const targetIndex = parentNode
      ? parentNode[childrenKey].findIndex((node: TreeNode) => node[idKey] === targetNode[idKey])
      : -1;
    return parentNode[childrenKey].slice(targetIndex - 1, targetIndex - 2)?.[0];
  }
  return null;
}

/**
 * 获取目标节点的所有左侧节点
 * @param tree 树数据
 * @param targetNode 目标节点
 * @param options 别名配置, 默认值为 { idKey: 'id', childrenKey: 'children' }
 */
export function getAllLeftNode(tree: Tree, targetNode: TreeNode, options?: TreeNodeFieldAlias): TreeNode[] {
  const { idKey = 'id', childrenKey = 'children' } = options || {};
  const parentNode = findParentTreeNode(tree, targetNode, options);
  if (parentNode && parentNode[childrenKey] instanceof Array) {
    const targetIndex = parentNode
      ? parentNode[childrenKey].findIndex((node: TreeNode) => node[idKey] === targetNode[idKey])
      : -1;
    return parentNode[childrenKey].slice(0, targetIndex);
  }
  return [];
}

/**
 * 删除空的 children 节点
 *
 * @export
 * @param tree 树类型数据
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function removeEmptyChildren(tree: Tree = [], options?: TreeNodeFieldAlias): Tree {
  const { childrenKey = 'children' } = options || {};
  return Array.isArray(tree)
    ? cloneDeep(tree).map((item) => {
        const result = { ...item };
        const { children } = result;
        if (Array.isArray(children) && children.length) {
          result[childrenKey] = removeEmptyChildren(children, options);
        } else {
          delete result[childrenKey];
        }
        return result;
      })
    : [];
}

/**
 * 获取树的深度
 * @param tree 树类型数据
 * @param options 别名配置, 默认值为 { childrenKey: 'children' }
 */
export function getTreeDepth(tree: Tree, options?: TreeNodeFieldAlias): number {
  const { childrenKey = 'children' } = options || {};
  let deep = 0;
  const fn = (data: any[], index: number) => {
    data.forEach((elem) => {
      if (index > deep) {
        deep = index;
      }
      if (elem[childrenKey]?.length > 0) {
        fn(elem[childrenKey], deep + 1);
      }
    });
  };
  if (tree instanceof Array) {
    fn(tree, 1);
  } else {
    fn([tree], 0);
  }
  return deep;
}

/**
 * 父节点影响子节点
 */
export function effectSubNode(
  tree: Tree = [],
  fieldName: string,
  fieldValue: any,
  effectObj = {},
  options?: TreeNodeFieldAlias,
): Tree {
  const { childrenKey = 'children' } = options || {};
  return cloneDeep(tree).map((item: Record<string, any>) => {
    let result = { ...item };
    const children = result[childrenKey];
    if (item[fieldName] === fieldValue) {
      result = { ...result, ...effectObj };
      if (Array.isArray(children) && children.length) {
        result[childrenKey] = mapTree(children, (data) => ({ ...data, ...effectObj }));
      }
    } else if (Array.isArray(children) && children.length) {
      result[childrenKey] = effectSubNode(children, fieldName, fieldValue, effectObj, options);
    }
    return result;
  });
}

/**
 * 子节点影响父节点
 */
export function effectParentNode(
  tree: Tree = [],
  fieldName: string,
  fieldValue: any,
  effectObj: Record<string, any>,
  options?: TreeNodeFieldAlias,
): Tree {
  const parentPathArray = closestParentItemInTree(tree, (item) => item[fieldName] === fieldValue, true, options);
  const { idKey = 'id' } = options || {};
  let result = cloneDeep(tree);
  parentPathArray.forEach((item) => {
    result = replaceTreeNode(
      result,
      (node) => node[idKey] === item[idKey],
      (node) => ({ ...node, ...effectObj }),
    );
  });
  return result;
}
