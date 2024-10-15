import { PaginationDto } from '../dto/pagination.dto'

export const parseQueryParameters = (paginationDto: PaginationDto, searchColumns: string[] = []) => {
  const { page, rowsPerPage, q } = paginationDto
  let findBy = undefined

  const skip = page && rowsPerPage ? (page - 1) * rowsPerPage : undefined
  const take = rowsPerPage > 0 ? rowsPerPage : undefined

  if (q !== undefined && q.trim() !== '') {
    findBy = []

    for (const column of searchColumns) {
      findBy.push({ [column]: { contains: q, mode: 'insensitive' } })
    }
  }

  return { skip, take, findBy }

}
