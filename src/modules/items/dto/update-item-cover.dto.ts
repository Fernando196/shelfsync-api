import { IsUUID, ValidateIf } from 'class-validator';

export class UpdateItemCoverDto {
  @ValidateIf((o) => o.photoId !== null)
  @IsUUID()
  photoId: string | null;
}
