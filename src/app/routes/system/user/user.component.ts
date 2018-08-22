import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-system-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class SystemUserComponent implements OnInit {
  q: any = {
    ps: 8,
    categories: [],
    owners: ['zxx'],
  };

  titles = [
    'Alipay',
    'Angular',
    'Ant Design',
    'Ant Design Pro',
    'Bootstrap',
    'React',
    'Vue',
    'Webpack',
  ];

  avatars = [
    'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
    'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
    'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
    'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
    'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
    'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
    'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
    'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
  ];
  covers = [
    'https://gw.alipayobjects.com/zos/rmsportal/HrxcVbrKnCJOZvtzSqjN.png',
    'https://gw.alipayobjects.com/zos/rmsportal/alaPpKWajEbIYEUvvVNf.png',
    'https://gw.alipayobjects.com/zos/rmsportal/RLwlKSYGSXGHuWSojyvp.png',
    'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
  ];
  desc = [
    '那是一种内在的东西， 他们到达不了，也无法触及的',
    '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    '生命就像一盒巧克力，结果往往出人意料',
    '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    '那时候我只会想自己想要什么，从不想自己拥有什么',
  ];

  user = [
    '卡色',
    'cipchk',
    '付小小',
    '曲丽丽',
    '林东东',
    '周星星',
    '吴加好',
    '朱偏右',
    '鱼酱',
    '乐哥',
    '谭小仪',
    '仲尼',
  ];

  list: any[] = [];

  loading = false;



  constructor(private http: _HttpClient, public msg: NzMessageService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;

    for (let i = 0; i < 20; i += 1) {
      this.list.push({
        id: `fake-list-${i}`,
        owner: this.user[i % 10],
        title: this.titles[i % 8],
        avatar: this.avatars[i % 8],
        cover:
          parseInt((i / 4).toString(), 10) % 2 === 0
            ? this.covers[i % 4]
            : this.covers[3 - i % 4],
        status: ['active', 'exception', 'normal'][i % 3],
        percent: Math.ceil(Math.random() * 50) + 50,
        logo: this.avatars[i % 8],
        href: 'https://ant.design',
        updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
        createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
        subDescription: this.desc[i % 5],
        description:
          '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
        activeUser: Math.ceil(Math.random() * 100000) + 100000,
        newUser: Math.ceil(Math.random() * 1000) + 1000,
        star: Math.ceil(Math.random() * 100) + 100,
        like: Math.ceil(Math.random() * 100) + 100,
        message: Math.ceil(Math.random() * 10) + 10,
        content:
          '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
        members: [
          {
            avatar:
              'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
            name: '曲丽丽',
          },
          {
            avatar:
              'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
            name: '王昭君',
          },
          {
            avatar:
              'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
            name: '董娜娜',
          },
        ],
      });
    }
    this.loading = false;
  }

}
