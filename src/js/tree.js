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
  this.parent = parent.name;
};

ObjectNode.prototype.updateWorldMatrix = function (parentWorldMatrix) {
  if (parentWorldMatrix) {
    // a matrix was passed in so do the math
    this.worldMatrix = matrices.multiply(parentWorldMatrix, this.localMatrix);
  } else {
    // no matrix was passed in so just copy local to world
    this.worldMatrix = this.localMatrix;
  }

  // now process all the children
  var worldMatrix = this.worldMatrix;
  this.worldInverseMatrix = matrices.transpose(
    matrices.inverse(this.worldMatrix)
  );
  this.children.forEach(function (child) {
    child.updateWorldMatrix(worldMatrix);
  });
};
