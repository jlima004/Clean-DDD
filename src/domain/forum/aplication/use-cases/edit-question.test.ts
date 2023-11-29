import { EditQuestionUseCase } from './edit-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = await makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await inMemoryQuestionRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      title: 'Pergunta Teste',
      content: 'Conteúdo teste',
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'Pergunta Teste',
      content: 'Conteúdo teste',
    })
  })

  it('should no be able to edit a question from another user', async () => {
    const newQuestion = await makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await inMemoryQuestionRepository.create(newQuestion)

    const promise = sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-2',
      title: 'Pergunta Teste',
      content: 'Conteúdo teste',
    })

    await expect(promise).rejects.toBeInstanceOf(Error)
  })
})
