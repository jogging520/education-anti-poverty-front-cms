import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Organization} from "@shared/models/general/organization";
import {Option} from "@shared/models/general/option";
import {Region} from "@shared/models/general/region";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'app-nb-region',
  templateUrl: './region.component.html',
  styles: []
})
export class RegionComponent implements OnInit {

  @Input() code: string;
  @Output() region: EventEmitter<number> = new EventEmitter();
  @Output() center: EventEmitter<number[]> = new EventEmitter();

  defaultRegion: number = 9;
  defaultCenter:number[] = [103.719156, 36.115523];

  regionOptions:any  = [] ;
  selectedRegion: any[];

  constructor(
    private cacheService: CacheService
  ) { }

  ngOnInit() {
    this.cacheService
      .get<Region>('region')
      .subscribe(region => {
        this.regionOptions.push(this.transform(this.locate(region, this.code)));
      });
  }

  onClear(event: any): void {
    this.region.emit(this.defaultRegion);
    this.center.emit(this.defaultCenter);
  }

  onChanges(event: any): void {
    if (event) {
      this.region.emit(this.selectedRegion[this.selectedRegion.length-1]);

      this.queryRegionLongitudeAndLatitude(this.selectedRegion[this.selectedRegion.length-1]);
    } else {
      this.region.emit(this.defaultRegion);
      this.center.emit(this.defaultCenter);
    }
  }


  /**
   * 方法：根据编号递归查找具体的区域位置
   * @param {region} region 区域
   * @param {string} code 编码
   * @return {Organization} 定位到的区域
   */
  public locate(region: Region, code: string): Region {
    if(region.code === code || code === '0')
      return region;

    let reg: Region;

    if (region.children) {
      for (let child of region.children) {
        reg = this.locate(child, code);

        if (reg)
          return reg;
      }
    }

    return null;
  }

  /**
   * 方法：将region转换成option（级联选择器）
   * @param {Region} organization 区域
   * @return {Option} 级联选择器的选项
   */
  public transform(region: Region): Option {

    if(!region)
      return null;

    let option: any = new Option();

    option.value = region.code;
    option.label = region.name;

    if (!region.children) {
      option.isLeaf = true;

      return option;
    }

    if (region.children) {
      for (let child of region.children) {
        option.children.push(this.transform(child));
      }
    }

    return option;
  }

  private queryRegionLongitudeAndLatitude(code: string): void {
    this.cacheService
      .get<Region>('region')
      .subscribe((region: Region) => {
        let locatedRegion: Region = this.locate(region, code);

        if (locatedRegion)
          this.center.emit([locatedRegion.longitude, locatedRegion.latitude]);
        else
          this.center.emit(this.defaultCenter);
      })
  }
}
