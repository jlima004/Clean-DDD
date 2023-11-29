import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository)
  })

  it('should be able to list recent questions', async () => {
    await inMemoryQuestionRepository.create(
      await makeQuestion({
        createdAt: new Date(2022, 0, 20),
      }),
    )

    await inMemoryQuestionRepository.create(
      await makeQuestion({
        createdAt: new Date(2022, 0, 18),
      }),
    )

    await inMemoryQuestionRepository.create(
      await makeQuestion({
        createdAt: new Date(2022, 0, 23),
      }),
    )

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to list paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(
        await makeQuestion({
          createdAt: new Date(2022, 0, i),
        }),
      )
    }

    const { questions } = await sut.execute({
      page: 2,
    })

    expect(questions).toHaveLength(2)

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 2) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 1) }),
    ])
  })
})
