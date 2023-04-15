const tree = {
  createNode(transform, render, sibling, child) {
    return {
      transform: transform,
      render: render,
      sibling: sibling,
      child: child,
    };
  },
};
