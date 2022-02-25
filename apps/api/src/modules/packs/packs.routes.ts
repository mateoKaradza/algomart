import {
  ClaimFreePack,
  ClaimPack,
  ClaimRedeemPack,
  Locale,
  LocaleAndExternalId,
  MintPack,
  OwnerExternalId,
  PackId,
  PacksByOwnerQuery,
  PackSlug,
  PackTemplateId,
  PublishedPacksQuery,
  RedeemCode,
  RevokePack,
  TransferPack,
} from '@algomart/schemas'
import { PacksService } from '@algomart/shared/services'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function searchPublishedPacks(
  request: FastifyRequest<{
    Querystring: PublishedPacksQuery
  }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.searchPublishedPacks(
    request.query,
    request.transaction,
    request.knexRead
  )
  reply.send(result)
}

export async function getPublishedPackBySlug(
  request: FastifyRequest<{
    Params: PackSlug
    Querystring: Locale
  }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.getPublishedPackBySlug(
    request.params.packSlug,
    request.query.locale,
    request.knexRead
  )

  reply.send(result)
}

export async function getPacksByOwner(
  request: FastifyRequest<{
    Params: OwnerExternalId
    Querystring: PacksByOwnerQuery
  }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.getPacksByOwner(
    {
      ...request.params,
      ...request.query,
    },
    request.knexRead
  )
  reply.send(result)
}

export async function getPackWithCollectiblesById(
  request: FastifyRequest<{
    Params: PackId
    Querystring: Locale
  }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.getPackWithCollectiblesById(
    request.params.packId,
    request.query.locale,
    request.knexRead
  )
  reply.send(result)
}

export async function getAuctionPackByTemplateId(
  request: FastifyRequest<{
    Params: PackTemplateId
  }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.getAuctionPackByTemplateId(
    request.params.templateId,
    request.knexRead
  )
  reply.send(result)
}

export async function getRedeemablePack(
  request: FastifyRequest<{ Params: RedeemCode; Querystring: Locale }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.getPackByRedeemCode(
    request.params.redeemCode,
    request.knexRead,
    request.query.locale
  )
  reply.send({ pack: result })
}

export async function untransferredPacks(
  request: FastifyRequest<{ Querystring: LocaleAndExternalId }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.untransferredPacks(
    request.query,
    request.knexRead
  )
  reply.send(result)
}

export async function claimRandomFreePack(
  request: FastifyRequest<{ Body: ClaimFreePack }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.claimRandomFreePack(
    request.body,
    request.transaction,
    request.knexRead
  )
  reply.send({ pack: result })
}

export async function claimRedeemPack(
  request: FastifyRequest<{ Body: ClaimRedeemPack; Querystring: Locale }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.claimRedeemPack(
    request.body,
    request.transaction,
    request.knexRead,
    request.query.locale
  )
  if (!result) {
    reply.notFound()
    return
  }

  reply.send({ pack: result })
}

export async function claimPack(
  request: FastifyRequest<{ Body: ClaimPack }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.claimPack(request.body, request.transaction)
  if (!result) {
    reply.badRequest('Unable to claim pack')
    return
  }
  reply.send({ pack: result })
}

export async function mintPackStatus(
  request: FastifyRequest<{ Querystring: MintPack }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const status = await service.getPackMintingStatus(
    request.query,
    request.knexRead
  )
  reply.send({
    status,
  })
}

export async function revokePack(
  request: FastifyRequest<{ Body: RevokePack }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.revokePack(
    request.body,
    request.transaction,
    request.knexRead
  )
  if (!result) {
    reply.badRequest('Unable to revoke pack')
    return
  }
  reply.status(204).send()
}

export async function transferPack(
  request: FastifyRequest<{ Body: TransferPack }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  await service.transferPack(
    request.body,
    request.transaction,
    request.knexRead
  )
  reply.status(204).send()
}

export async function transferPackStatus(
  request: FastifyRequest<{ Params: PackId }>,
  reply: FastifyReply
) {
  const service = request.getContainer().get<PacksService>(PacksService.name)
  const result = await service.transferPackStatus(
    request.params.packId,
    request.knexRead
  )
  reply.send(result)
}
