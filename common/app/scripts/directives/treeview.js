/*

  OBS!!! - MODIFIED BY BMM

  @license Angular Treeview version 0.1.6
  ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
  License: MIT

  [TREE attribute]
  angular-treeview: the treeview directive
  tree-id : each tree's unique id.
  tree-model : the tree model on $scope.
  node-id : each node's id
  node-label : each node's label
  node-children: each node's children

  <div
    data-angular-treeview="true"
    data-tree-id="tree"
    data-tree-model="roleList"
    data-node-id="roleId"
    data-node-label="roleName"
    data-node-children="children" >
  </div>
*/

/**
 * @todo - This directive is now temporary. Archive should be redesigned
 */

'use strict';
angular.module('bmmLibApp')
  .directive('treeview', function($compile) {
    return {
      restrict: 'A',
      link: function ( scope, element, attrs ) {
        //tree id
        var treeId = attrs.treeId;

        //tree model
        var treeview = attrs.treeview;

        //node id
        var nodeId = attrs.nodeId || 'id';

        //node label
        var nodeLabel = attrs.nodeLabel || 'label';

        //children
        var nodeChildren = attrs.nodeChildren || 'children';

        //tree template
        var template =
          '<ul>' +
            '<li data-ng-repeat="node in ' + treeview + '"'+
                 'id="{{node.roleId}}" language="{{node.language}}" type="{{node.group}}">'+
              '<i class="collapsed" data-ng-show="(node.group==\'album\'||node.group==\'year\') && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
              '<i class="expanded" data-ng-show="(node.group==\'album\'||node.group==\'year\') && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
              '<i class="normal" data-ng-hide="(node.group==\'album\'||node.group==\'year\')"></i> ' +
              '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
              '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-treeview="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
            '</li>' +
          '</ul>';

        //check tree id, tree model
        if( treeId && treeview ) {
          //root node
          if( attrs.bmmLibApp ) {

            //create tree object if not exists
            scope[treeId] = scope[treeId] || {};

            //if node head clicks,
            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

              //Collapse or Expand
              selectedNode.collapsed = !selectedNode.collapsed;
              scope[treeId].expandedNode = selectedNode;
            };

            //if node label clicks,
            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

              //remove highlight from previous node
              if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
                scope[treeId].currentNode.selected = undefined;
              }

              //set highlight to selected node
              selectedNode.selected = 'selected';

              //set currentNode
              scope[treeId].currentNode = selectedNode;
            };
          }

          //Rendering template.
          element.html('').append( $compile( template )( scope ) );
        }
      }
    };
  });
