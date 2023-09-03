import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ArrayHelper } from '../../../../common/helper/array.helper';
import { BiddingDto } from '../../application/dto/bidding.dto';
import { BiddingPaginatedDto } from '../../application/dto/bidding-paginated.dto';
import { BiddingRepository } from '../../application/repository/bidding.repository';
import { FilterRequestDto } from '../dto/filter-request.dto';
import { Bidding } from '../schema/bidding.schema';

@Injectable()
export class BiddingMongoRepository implements BiddingRepository {
  private readonly logger = new Logger(BiddingMongoRepository.name);

  constructor(
    @InjectModel(Bidding.name)
    private readonly biddingRepo: Model<Bidding>,
  ) {}

  async findBiddings(filter: FilterRequestDto): Promise<BiddingPaginatedDto> {
    const { search, page = 1, pageSize = 10 } = filter;
    const skip = (page - 1) * pageSize;

    try {
      const findQuery = this.biddingRepo.find();

      if (search) {
        const searchArray = search.split(' ');
        const searchConditions = searchArray.map((search) => ({
          resumo: { $regex: search, $options: 'i' },
          'itens.descricao': { $regex: search, $options: 'i' },
        }));

        findQuery.or(searchConditions);
      }

      const totalItems = await findQuery.clone().countDocuments().exec();
      const items = await findQuery.clone().skip(skip).limit(pageSize).exec();

      return {
        items,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findBiddingsByCodes(biddingCodes: number[]): Promise<BiddingDto[]> {
    this.logger.log(`Buscando processos de licitação.`);

    try {
      const biddings = await this.biddingRepo
        .find({ codigoLicitacao: { $in: biddingCodes } })
        .exec();

      return biddings?.map((bidding) => bidding?.toJSON());
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async saveBiddings(biddings: BiddingDto[]): Promise<BiddingDto[]> {
    this.logger.log(`Salvando novos processos de licitação.`);

    try {
      const savedBiddings: BiddingDto[] = [];

      const chunks = ArrayHelper.chunk(biddings, 1000);
      for (const chunk of chunks) {
        const result = await this.biddingRepo.insertMany(chunk);
        savedBiddings.push(...result);
      }

      return savedBiddings;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async updateBiddings(biddings: BiddingDto[]): Promise<void> {
    this.logger.log(`Atualizando processos de licitação já existentes.`);

    try {
      const chunks = ArrayHelper.chunk(biddings, 1000);
      for (const chunk of chunks) {
        await this.biddingRepo
          .updateMany(
            {
              codigoLicitacao: {
                $in: chunk.map((bidding) => bidding.codigoLicitacao),
              },
            },
            { $set: chunk },
          )
          .exec();
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async deleteBiddings(biddings: BiddingDto[]): Promise<void> {
    this.logger.log(`Deletando processos de licitação antigos.`);

    try {
      const chunks = ArrayHelper.chunk(biddings, 1000);
      for (const chunk of chunks) {
        await this.biddingRepo
          .deleteMany({
            codigoLicitacao: {
              $nin: chunk?.map((bidding) => bidding?.codigoLicitacao),
            },
          })
          .exec();
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
