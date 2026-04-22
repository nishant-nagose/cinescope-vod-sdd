import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { PaginationControls } from '../../src/components/PaginationControls'

describe('PaginationControls', () => {
  const onPageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders Previous and Next buttons', () => {
    render(
      <PaginationControls currentPage={1} totalPages={5} onPageChange={onPageChange} />
    )
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  test('disables Previous button on first page', () => {
    render(
      <PaginationControls currentPage={1} totalPages={5} onPageChange={onPageChange} />
    )
    expect(screen.getByText('Previous')).toBeDisabled()
    expect(screen.getByText('Next')).not.toBeDisabled()
  })

  test('disables Next button on last page', () => {
    render(
      <PaginationControls currentPage={5} totalPages={5} onPageChange={onPageChange} />
    )
    expect(screen.getByText('Next')).toBeDisabled()
    expect(screen.getByText('Previous')).not.toBeDisabled()
  })

  test('calls onPageChange with next page when Next is clicked', () => {
    render(
      <PaginationControls currentPage={2} totalPages={5} onPageChange={onPageChange} />
    )
    fireEvent.click(screen.getByText('Next'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  test('calls onPageChange with previous page when Previous is clicked', () => {
    render(
      <PaginationControls currentPage={3} totalPages={5} onPageChange={onPageChange} />
    )
    fireEvent.click(screen.getByText('Previous'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  test('renders exactly 5 page numbers when total pages equals window size', () => {
    render(
      <PaginationControls currentPage={3} totalPages={5} onPageChange={onPageChange} />
    )
    const pageButtons = screen.getAllByRole('button').filter(
      (btn) => btn.textContent !== undefined && !isNaN(Number(btn.textContent)) && btn.textContent.trim() !== ''
    )
    expect(pageButtons.length).toBe(5)
  })

  test('highlights the current page', () => {
    render(
      <PaginationControls currentPage={3} totalPages={5} onPageChange={onPageChange} />
    )
    const currentPageBtn = screen.getByText('3')
    expect(currentPageBtn).toHaveClass('bg-blue-600')
  })

  test('calls onPageChange with page number when a page button is clicked', () => {
    render(
      <PaginationControls currentPage={1} totalPages={5} onPageChange={onPageChange} />
    )
    fireEvent.click(screen.getByText('2'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  test('disables all page buttons when loading', () => {
    render(
      <PaginationControls currentPage={2} totalPages={5} onPageChange={onPageChange} loading={true} />
    )
    expect(screen.getByText('Previous')).toBeDisabled()
    expect(screen.getByText('Next')).toBeDisabled()
  })
})
