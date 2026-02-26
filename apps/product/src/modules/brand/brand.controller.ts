import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { JoiValidationPipe, PaginationQuery } from "@app/common";
import { createBrandSchema, listBrandSchema, updateBrandSchema } from "./brand.validator";


@Controller('brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @Post()
    @UsePipes(new JoiValidationPipe(createBrandSchema))
    async create(@Body() body: any) {
        return this.brandService.create(body);
    }

    @Get()
    @UsePipes(new JoiValidationPipe(listBrandSchema))
    async list(@Query() query: PaginationQuery) {
        return this.brandService.list(query);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.brandService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body(new JoiValidationPipe(updateBrandSchema)) body: any) {
        return this.brandService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.brandService.delete(id);
    }
}