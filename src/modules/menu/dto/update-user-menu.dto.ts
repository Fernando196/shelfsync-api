import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsUUID, ValidateNested } from 'class-validator';

export class UserMenuAccessDto {
  @IsUUID()
  menuId: string;

  @IsBoolean()
  canView: boolean;

  @IsBoolean()
  canCreate: boolean;

  @IsBoolean()
  canEdit: boolean;

  @IsBoolean()
  canDelete: boolean;
}

export class UpdateUserMenuDto {
  @IsArray()
  @ArrayUnique((item: UserMenuAccessDto) => item.menuId)
  @ValidateNested({ each: true })
  @Type(() => UserMenuAccessDto)
  items: UserMenuAccessDto[];
}
