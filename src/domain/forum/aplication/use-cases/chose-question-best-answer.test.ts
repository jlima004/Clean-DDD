import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChoseQuestionBestAnswerUseCase } from './chose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: ChoseQuestionBestAnswerUseCase

describe('Chose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new ChoseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswerRepository,
    )
  })

  it('should be able to chose question best answer', async () => {
    const newQuestion = await makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await inMemoryQuestionsRepository.create(newQuestion)

    const newAnswer = await makeAnswer(
      {
        questionId: newQuestion.id,
      },
      new UniqueEntityId('answer-1'),
    )
    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toString(),
    })

    expect(newQuestion.bestAnswerId).toEqual(newAnswer.id)
  })

  it('should no be able to chose another user question best answer', async () => {
    const newQuestion = await makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await inMemoryQuestionsRepository.create(newQuestion)

    const newAnswer = await makeAnswer(
      {
        questionId: newQuestion.id,
      },
      new UniqueEntityId('answer-1'),
    )
    await inMemoryAnswerRepository.create(newAnswer)

    const promise = sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
    })

    await expect(promise).rejects.toBeInstanceOf(Error)
  })
})
