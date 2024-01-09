import React from 'react';

export const nodes = [
  {
    id: '1',
    type: 'start',
    data: {
      url: 'https://juejin.cn/'
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    type: 'logic_loop',
    data: {
     
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'opt_click',
    data: {
      optsetting: {
        optType: 'opt_click',
        xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/div[1]/header[1]/div[1]/nav[1]/ul[1]/li[1]/ul[1]/li[2]/a[1]',
        waitTime: 0,
        clickData: {
          isCurrentPage: 2,
        }
      }
    },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'opt_input',
    position: { x: 250, y: 200 },
    data: {
     
    },
  },
  {
    id: '5',
    type: 'opt_pick',
    data: {
      label: 'Node id: 5',
    },
    position: { x: 250, y: 325 },
  },
  {
    id: '6',
    type: 'end',
    data: {
      label: (
        <>
          An <strong>output node</strong>
        </>
      ),
    },
    position: { x: 100, y: 480 },
  },
  {
    id: '7',
    type: 'logic_export',
    data: { label: 'Another output node' },
    position: { x: 400, y: 450 },
  },
];

export const edges = [{"id":"e1-3","source":"1","target":"3"},{"id":"e3-4","source":"3","target":"4"},{"source":"4","sourceHandle":null,"target":"2","targetHandle":null,"id":"reactflow__edge-4-2"},{"source":"2","sourceHandle":"loopbody","target":"5","targetHandle":null,"id":"reactflow__edge-2loopbody-5"},{"source":"2","sourceHandle":"next","target":"7","targetHandle":null,"id":"reactflow__edge-2next-7"},{"source":"7","sourceHandle":null,"target":"6","targetHandle":null,"id":"reactflow__edge-7-6"}]