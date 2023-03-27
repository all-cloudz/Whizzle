package com.bear.whizzle.whisky;

import com.bear.whizzle.domain.model.entity.Whisky;
import com.bear.whizzle.keep.repository.KeepRepository;
import com.bear.whizzle.recommend.RecWhiskyMapper;
import com.bear.whizzle.recommend.controller.dto.RecWhiskyResponseDto;
import com.bear.whizzle.whisky.repository.WhiskyRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RecWhiskyResponseTest {

    @Autowired
    private WhiskyRepository whiskyRepository;

    @Autowired
    private KeepRepository keepRepository;


    @Test
    @DisplayName("추천받은 위스키 정보 조회 테스트")
    void recWhiskyTest() {
        // given
        List<Long> recWhiskies = List.of(29L,1L,10L,45L,505L,477L,616L,770L);
        Long memberId = 1L;

        // when
        Map<Long, Whisky> whiskies = whiskyRepository.findByIds(recWhiskies);
        Map<Long, Boolean> myKeeps = keepRepository.whetherKeep(recWhiskies, memberId);
        List<RecWhiskyResponseDto> recWhiskyResponseDtos = new ArrayList<>();
        recWhiskies.forEach(r -> recWhiskyResponseDtos.add(RecWhiskyMapper.toRecWhiskyResponseDto(whiskies.get(r), myKeeps.containsKey(r))));
        // then
        recWhiskyResponseDtos.forEach(r -> System.out.println(r));
        Assertions.assertThat(recWhiskyResponseDtos).hasSameSizeAs(recWhiskies);
    }
}
