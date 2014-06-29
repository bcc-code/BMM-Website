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
    data-admin="false"
    data-angular-treeview="true"
    data-tree-id="tree"
    data-tree-model="roleList"
    data-node-id="roleId"
    data-node-label="roleName"
    data-node-children="children" >
  </div>
*/

'use strict';
angular.module('bmmLibApp')
  .directive( 'treeview', ['$compile', function( $compile ) {
    return {
      restrict: 'A',
      link: function ( scope, element, attrs ) {
        //tree id
        var treeId = attrs.treeId;

        //tree id
        var admin = attrs.admin;
      
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
            '<li ng-show="{{admin}}">'+
              '<i class="new-track" ng-hide="node.group==\'year\'||node.group==undefined" ng-click="node.newTrack=true;node.newAlbum=false;">Ny Track</i>' +
              '<i class="new-album" ng-hide="node.group==\'year\'" ng-click="node.newAlbum=true;node.newTrack=false;">Nytt album</i>' +
              '<form ng-show="node.newTrack" ng-submit="addTrack(node);">'+
                '<input placeholder="Track tittel" ng-model="node.title" type="text">'+
                '<input type="submit" value="" class="bmm-confirm">'+
                '<div class="bmm-remove" ng-click="node.newTrack = false"></div>'+
              '</form>'+
              '<form ng-show="node.newAlbum" ng-submit="addAlbum(node);">'+
                '<input placeholder="Album tittel" ng-model="node.title" type="text">'+
                '<input type="submit" value="" class="bmm-confirm">'+
                '<div class="bmm-remove" ng-click="node.newAlbum = false"></div>'+
              '</form>'+
            '</li>'+
            '<li data-ng-repeat="node in ' + treeview + '"'+
                 'id="{{node.roleId}}" language="{{node.language}}" type="{{node.group}}"'+
                 'ng-class="{draggable: node.group==\'track\''+
                 ', \'admin-draggable\': ((node.group==\'album\'||node.group==\'track\')&&admin)'+ //&&admin
                 ', \'admin-droppable\': (node.group!=\'track\'&&admin)'+
                 '}">'+
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
          
            scope.admin = admin || false;

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
  }]);
