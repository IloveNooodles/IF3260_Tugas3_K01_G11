var ObjectNode = function () {
  this.children = [];
  this.localMatrix = matrices.identity();
  this.worldMatrix = matrices.identity();
  this.worldInverseMatrix = matrices.identity();
};

ObjectNode.prototype.setParent = function (parent) {
  // remove us from our parent
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};

ObjectNode.prototype.updateWorldMatrix = function (
  parentWorldMatrix,
  parentWorldInverseMatrix
) {
  if (parentWorldMatrix) {
    // a matrix was passed in so do the math
    this.worldMatrix = matrices.multiply(parentWorldMatrix, this.localMatrix);
    this.worldInverseMatrix = matrices.multiply(
      parentWorldInverseMatrix,
      this.localInverseMatrix
    );
  } else {
    // no matrix was passed in so just copy local to world
    this.worldMatrix = this.localMatrix;
  }

  // now process all the children
  var worldMatrix = this.worldMatrix;
  var worldInverseMatrix = this.worldInverseMatrix;
  this.children.forEach(function (child) {
    child.updateWorldMatrix(worldMatrix, worldInverseMatrix);
  });
};
